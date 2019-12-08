import { vec3, quat } from 'gl-matrix';
import ModelInstance from '../../modelinstance';
import { createSkeletalNodes, SkeletalNode } from '../../node';
import Node from './node';
import AttachmentInstance from './attachmentinstance';
import ParticleEmitter from './particleemitter';
import ParticleEmitter2 from './particleemitter2';
import RibbonEmitter from './ribbonemitter';
import EventObjectSpnEmitter from './eventobjectspnemitter';
import EventObjectSplEmitter from './eventobjectsplemitter';
import EventObjectUbrEmitter from './eventobjectubremitter';
import EventObjectSndEmitter from './eventobjectsndemitter';
import DataTexture from '../../gl/datatexture';
import MdxModel from './model';
import GenericObject from './genericobject';
import Scene from '../../scene';

// Heap allocations needed for this module.
const visibilityHeap = new Float32Array(1);
const translationHeap = vec3.create();
const rotationHeap = quat.create();
const scaleHeap = vec3.create();
const colorHeap = vec3.create();
const alphaHeap = new Float32Array(1);
const textureIdHeap = new Uint32Array(1);

/**
 * An MDX model instance.
 */
export default class MdxComplexInstance extends ModelInstance {
  attachments: AttachmentInstance[];
  particleEmitters: ParticleEmitter[];
  particleEmitters2: ParticleEmitter2[];
  ribbonEmitters: RibbonEmitter[];
  eventObjectEmitters: (EventObjectSpnEmitter | EventObjectSplEmitter | EventObjectUbrEmitter | EventObjectSndEmitter)[];
  nodes: SkeletalNode[];
  sortedNodes: SkeletalNode[];
  frame: number;
  counter: number;
  sequence: number;
  sequenceLoopMode: number;
  sequenceEnded: boolean;
  teamColor: number;
  vertexColor: Float32Array;
  allowParticleSpawn: boolean;
  forced: boolean;
  geosetColors: Float32Array[];
  layerAlphas: number[];
  layerTextures: number[];
  uvAnims: Float32Array[];
  worldMatrices: Float32Array | null;
  boneTexture: DataTexture | null;

  constructor(model: MdxModel) {
    super(model);

    this.attachments = [];
    this.particleEmitters = [];
    this.particleEmitters2 = [];
    this.ribbonEmitters = [];
    this.eventObjectEmitters = [];
    this.nodes = [];
    this.sortedNodes = [];
    this.frame = 0;
    this.counter = 0; // Global sequences
    this.sequence = -1;
    this.sequenceLoopMode = 0;
    this.sequenceEnded = false;
    this.teamColor = 0;
    this.vertexColor = new Float32Array([1, 1, 1, 1]);
    this.allowParticleSpawn = false; // Particles do not spawn when the sequence is -1, or when the sequence finished and it's not repeating
    // If forced is true, everything will update regardless of variancy.
    // Any later non-forced update can then use variancy to skip updating things.
    // It is set to true every time the sequence is set with setSequence().
    this.forced = true;
    this.geosetColors = [];
    this.layerAlphas = [];
    this.layerTextures = [];
    this.uvAnims = [];
    this.worldMatrices = null;
    this.boneTexture = null;
  }

  load() {
    let model = <MdxModel>this.model;

    for (let i = 0, l = model.geosets.length; i < l; i++) {
      this.geosetColors[i] = new Float32Array(4);
    }

    for (let i = 0, l = model.layers.length; i < l; i++) {
      this.layerAlphas[i] = 0;
      this.layerTextures[i] = 0;
      this.uvAnims[i] = new Float32Array(5);
    }

    // Create the needed amount of shared nodes.
    let sharedNodeData = createSkeletalNodes(model.genericObjects.length, Node);
    let nodes = sharedNodeData.nodes;
    let nodeIndex = 0;

    this.nodes.push(...nodes);

    // A shared typed array for all world matrices of the internal nodes.
    this.worldMatrices = sharedNodeData.worldMatrices;

    // And now initialize all of the nodes and objects
    for (let bone of model.bones) {
      this.initNode(nodes, nodes[nodeIndex++], bone);
    }

    for (let light of model.lights) {
      this.initNode(nodes, nodes[nodeIndex++], light);
    }

    for (let helper of model.helpers) {
      this.initNode(nodes, nodes[nodeIndex++], helper);
    }

    for (let attachment of model.attachments) {
      let attachmentInstance;

      // Attachments may have game models attached to them, such as Undead and Nightelf building animations.
      if (attachment.internalModel) {
        attachmentInstance = new AttachmentInstance(this, attachment);

        this.attachments.push(attachmentInstance);
      }

      this.initNode(nodes, nodes[nodeIndex++], attachment, attachmentInstance);
    }

    for (let emitterObject of model.particleEmitters) {
      let emitter = new ParticleEmitter(this, emitterObject);

      this.particleEmitters.push(emitter);

      this.initNode(nodes, nodes[nodeIndex++], emitterObject, emitter);
    }

    for (let emitterObject of model.particleEmitters2) {
      let emitter = new ParticleEmitter2(this, emitterObject);

      this.particleEmitters2.push(emitter);

      this.initNode(nodes, nodes[nodeIndex++], emitterObject, emitter);
    }

    for (let emitterObject of model.ribbonEmitters) {
      let emitter = new RibbonEmitter(this, emitterObject);

      this.ribbonEmitters.push(emitter);

      this.initNode(nodes, nodes[nodeIndex++], emitterObject, emitter);
    }

    for (let emitterObject of model.eventObjects) {
      let type = emitterObject.type;
      let emitter;

      if (type === 'SPN') {
        emitter = new EventObjectSpnEmitter(this, emitterObject);
      } else if (type === 'SPL') {
        emitter = new EventObjectSplEmitter(this, emitterObject);
      } else if (type === 'UBR') {
        emitter = new EventObjectUbrEmitter(this, emitterObject);
      } else {
        emitter = new EventObjectSndEmitter(this, emitterObject);
      }

      this.eventObjectEmitters.push(emitter);

      this.initNode(nodes, nodes[nodeIndex++], emitterObject, emitter);
    }

    for (let collisionShape of model.collisionShapes) {
      this.initNode(nodes, nodes[nodeIndex++], collisionShape);
    }

    // Save a sorted array of all of the nodes, such that every child node comes after its parent.
    // This allows for flat iteration when updating.
    let hierarchy = model.hierarchy;

    for (let i = 0, l = nodes.length; i < l; i++) {
      this.sortedNodes[i] = nodes[hierarchy[i]];
    }

    // If the sequence was changed before the model was loaded, reset it now that the model loaded.
    this.setSequence(this.sequence);

    if (model.bones.length) {
      this.boneTexture = new DataTexture(model.viewer.gl, 4, model.bones.length * 4, 1);
    }
  }

  /**
   * Clear all of the emitted objects that belong to this instance.
   */
  clearEmittedObjects() {
    for (let emitter of this.particleEmitters) {
      emitter.clear();
    }

    for (let emitter of this.particleEmitters2) {
      emitter.clear();
    }

    for (let emitter of this.ribbonEmitters) {
      emitter.clear();
    }

    for (let emitter of this.eventObjectEmitters) {
      emitter.clear();
    }
  }

  /**
   * Initialize a skeletal node.
   */
  initNode(nodes: SkeletalNode[], node: SkeletalNode, genericObject: GenericObject, object?: any) {
    node.pivot.set(genericObject.pivot);

    if (genericObject.parentId === -1) {
      node.parent = this;
    } else {
      node.parent = nodes[genericObject.parentId];
    }

    /// TODO: single-axis billboarding
    if (genericObject.billboarded) {
      node.billboarded = true;
    }// else if (genericObject.billboardedX) {
    //   node.billboardedX = true;
    // } else if (genericObject.billboardedY) {
    //   node.billboardedY = true;
    // } else if (genericObject.billboardedZ) {
    //   node.billboardedZ = true;
    // }

    if (object) {
      node.object = object;
    }
  }

  /**
   * Overriden to hide also attachment models.
   */
  hide() {
    super.hide();

    for (let attachment of this.attachments) {
      attachment.internalInstance.hide();
    }
  }

  /**
   * Updates all of this instance internal nodes and objects.
   * Nodes that are determined to not be visible will not be updated, nor will any of their children down the hierarchy.
   */
  updateNodes(dt: number, forced: boolean) {
    let sortedNodes = this.sortedNodes;
    let sequence = this.sequence;
    let model = <MdxModel>this.model;
    let sortedGenericObjects = model.sortedGenericObjects;
    let scene = <Scene>this.scene;

    // Update the nodes
    for (let i = 0, l = sortedNodes.length; i < l; i++) {
      let genericObject = sortedGenericObjects[i];
      let node = sortedNodes[i];
      let parent = node.parent;

      genericObject.getVisibility(visibilityHeap, this);

      let objectVisible = visibilityHeap[0] > 0;
      let nodeVisible = forced || (parent.visible && objectVisible);

      node.visible = nodeVisible;

      // Every node only needs to be updated if this is a forced update, or if both the parent node and the generic object corresponding to this node are visible.
      // Incoming messy code for optimizations!
      if (nodeVisible) {
        let wasDirty = false;
        let variants = genericObject.variants;
        let localLocation = node.localLocation;
        let localRotation = node.localRotation;
        let localScale = node.localScale;

        // Only update the local node data if there is a need to
        if (forced || variants.generic[sequence]) {
          wasDirty = true;

          // Translation
          if (forced || variants.translation[sequence]) {
            genericObject.getTranslation(translationHeap, this);

            localLocation[0] = translationHeap[0];
            localLocation[1] = translationHeap[1];
            localLocation[2] = translationHeap[2];
          }

          // Rotation
          if (forced || variants.rotation[sequence]) {
            genericObject.getRotation(rotationHeap, this);

            localRotation[0] = rotationHeap[0];
            localRotation[1] = rotationHeap[1];
            localRotation[2] = rotationHeap[2];
            localRotation[3] = rotationHeap[3];
          }

          // Scale
          if (forced || variants.scale[sequence]) {
            genericObject.getScale(scaleHeap, this);

            localScale[0] = scaleHeap[0];
            localScale[1] = scaleHeap[1];
            localScale[2] = scaleHeap[2];
          }
        }

        let wasReallyDirty = forced || wasDirty || parent.wasDirty || genericObject.anyBillboarding;

        node.wasDirty = wasReallyDirty;

        // If this is a forced update, or this node's local data was updated, or the parent node was updated, do a full world update.
        if (wasReallyDirty) {
          node.recalculateTransformation(scene);
        }

        // If there is an instance object associated with this node, and the node is visible (which might not be the case for a forced update!), update the object.
        // This includes attachments and emitters.
        let object = node.object;

        if (object && objectVisible) {
          object.update(dt);
        }

        // Update all of the node's non-skeletal children, which will update their children, and so on.
        node.updateChildren(dt, scene);
      }
    }
  }

  /**
   * Update the batch data.
   */
  updateBatches(forced: boolean) {
    let model = <MdxModel>this.model;
    let geosets = model.geosets;
    let layers = model.layers;
    let geosetColors = this.geosetColors;
    let layerAlphas = this.layerAlphas;
    let layerTextures = this.layerTextures;
    let uvAnims = this.uvAnims;
    let sequence = this.sequence;

    // Geosets
    for (let i = 0, l = geosets.length; i < l; i++) {
      let geoset = geosets[i];
      let geosetColor = geosetColors[i];

      // Color
      if (forced || geoset.variants.color[sequence]) {
        geoset.getColor(colorHeap, this);

        geosetColor[0] = colorHeap[0];
        geosetColor[1] = colorHeap[1];
        geosetColor[2] = colorHeap[2];
      }

      // Alpha
      if (forced || geoset.variants.alpha[sequence]) {
        geoset.getAlpha(alphaHeap, this);

        geosetColor[3] = alphaHeap[0];
      }
    }

    // Layers
    for (let i = 0, l = layers.length; i < l; i++) {
      let layer = layers[i];
      let uvAnim = uvAnims[i];

      // Alpha
      if (forced || layer.variants.alpha[sequence]) {
        layer.getAlpha(alphaHeap, this);

        layerAlphas[i] = alphaHeap[0];
      }

      // UV translation animation
      if (forced || layer.variants.translation[sequence]) {
        layer.getTranslation(translationHeap, this);

        uvAnim[0] = translationHeap[0];
        uvAnim[1] = translationHeap[1];
      }

      // UV rotation animation
      if (forced || layer.variants.rotation[sequence]) {
        layer.getRotation(rotationHeap, this);

        uvAnim[2] = rotationHeap[2];
        uvAnim[3] = rotationHeap[3];
      }

      // UV scale animation
      if (forced || layer.variants.scale[sequence]) {
        layer.getScale(scaleHeap, this);

        uvAnim[4] = scaleHeap[0];
      }

      // Sprite animation
      if (forced || layer.variants.slot[sequence]) {
        layer.getTextureId(textureIdHeap, this);

        layerTextures[i] = textureIdHeap[0];
      }
    }
  }

  updateBoneTexture() {
    if (this.boneTexture) {
      this.boneTexture.bindAndUpdate(this.worldMatrices);
    }
  }

  renderOpaque() {
    let model = <MdxModel>this.model;

    for (let group of model.opaqueGroups) {
      group.render(this);
    }
  }

  renderTranslucent() {
    let model = <MdxModel>this.model;

    for (let group of model.translucentGroups) {
      group.render(this);
    }
  }

  updateAnimations(dt: number) {
    let model = <MdxModel>this.model;
    let sequenceId = this.sequence;

    if (sequenceId !== -1) {
      let sequence = model.sequences[sequenceId];
      let interval = sequence.interval;
      let frameTime = model.viewer.frameTime;

      this.frame += frameTime;
      this.counter += frameTime;
      this.allowParticleSpawn = true;

      if (this.frame >= interval[1]) {
        if (this.sequenceLoopMode === 2 || (this.sequenceLoopMode === 0 && sequence.flags === 0)) {
          this.frame = interval[0];

          this.resetEventEmitters();
        } else {
          this.frame = interval[1];
          this.counter -= frameTime;
          this.allowParticleSpawn = false;
        }

        this.sequenceEnded = true;
      } else {
        this.sequenceEnded = false;
      }
    }

    let forced = this.forced;

    if (sequenceId === -1) {
      if (forced) {
        // Update the nodes
        this.updateNodes(dt, forced);

        this.updateBoneTexture();

        // Update the batches
        this.updateBatches(forced);
      }
    } else {
      let variants = model.variants;

      //if (forced || variants.nodes[sequenceId]) {
      // Update the nodes
      this.updateNodes(dt, forced);

      this.updateBoneTexture();
      //}

      if (forced || variants.batches[sequenceId]) {
        // Update the batches
        this.updateBatches(forced);
      }
    }

    this.forced = false;
  }

  /**
   * Set the team color of this instance.
   */
  setTeamColor(id: number) {
    this.teamColor = id;

    return this;
  }

  /**
   * Set the vertex color of this instance.
   */
  setVertexColor(color: Float32Array | number[]) {
    this.vertexColor.set(color);

    return this;
  }

  /**
   * Set the sequence of this instance.
   */
  setSequence(id: number) {
    let model = <MdxModel>this.model;

    this.sequence = id;

    if (model.ok) {
      let sequences = model.sequences;

      if (id < 0 || id > sequences.length - 1) {
        this.sequence = -1;
        this.frame = 0;
        this.allowParticleSpawn = false;
      } else {
        this.frame = sequences[id].interval[0];
      }

      this.resetEventEmitters();

      this.forced = true;
    }

    return this;
  }

  /**
   * Set the seuqnece loop mode.
   * 0 to never loop, 1 to loop based on the model, and 2 to always loop.
   */
  setSequenceLoopMode(mode: number) {
    this.sequenceLoopMode = mode;

    return this;
  }

  /**
   * Get an attachment node.
   */
  getAttachment(id: number) {
    let model = <MdxModel>this.model;
    let attachment = model.attachments[id];

    if (attachment) {
      return this.nodes[attachment.index];
    }
  }

  /**
   * Event emitters depend on keyframe index changes to emit, rather than only values.
   * To work, they need to check what the last keyframe was, and only if it's a different one, do something.
   * When changing sequences, these states need to be reset, so they can immediately emit things if needed.
   */
  resetEventEmitters() {
    /// TODO: Update this.
    // for (let eventEmitterView of this.eventObjectEmitters) {
    //   eventEmitterView.reset();
    // }
  }
}
