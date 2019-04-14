import {vec3, quat} from 'gl-matrix';
import TexturedModelInstance from '../../texturedmodelinstance';
import {createSkeletalNodes} from '../../node';
import Node from './node';
import AttachmentInstance from './attachmentinstance';
import ParticleEmitterView from './particleemitterview';
import ParticleEmitter2View from './particleemitter2view';
import RibbonEmitterView from './ribbonemitterview';
import EventObjectEmitterView from './eventobjectemitterview';

// Heap allocations needed for this module.
let visibilityHeap = new Float32Array(1);
let translationHeap = vec3.create();
let rotationHeap = quat.create();
let scaleHeap = vec3.create();
let colorHeap = new Float32Array(3);
let alphaHeap = new Float32Array(1);
let textureIdHeap = new Float32Array(1);

/**
 * An MDX model instance.
 */
export default class ModelInstance extends TexturedModelInstance {
  /**
   * @param {MdxModel} model
   */
  constructor(model) {
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

    this.teamColor = 0;
    this.vertexColor = new Uint8Array([255, 255, 255, 255]);

    this.allowParticleSpawn = false; // Particles do not spawn when the sequence is -1, or when the sequence finished and it's not repeating

    // If forced is true, everything will update regardless of variancy.
    // Any later non-forced update can then use variancy to skip updating things.
    // It is set to true every time the sequence is set with setSequence().
    this.forced = true;
  }

  /**
   * Called when the model finishes loading, or immediately if it was already loaded when this instance was created.
   */
  load() {
    let model = this.model;
    let geosetCount = model.geosets.length;
    let layerCount = model.layers.length;

    this.geosetColors = new Uint8Array(geosetCount * 4);
    this.layerAlphas = new Uint8Array(layerCount);
    this.uvOffsets = new Float32Array(layerCount * 4);
    this.uvScales = new Float32Array(layerCount);
    this.uvRots = new Float32Array(layerCount * 2);

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

    for (let emitter of model.particleEmitters) {
      let emitterView = new ParticleEmitterView(this, emitter);

      this.particleEmitters.push(emitterView);

      this.initNode(nodes, nodes[nodeIndex++], emitter, emitterView);
    }

    for (let emitter of model.particleEmitters2) {
      let emitterView = new ParticleEmitter2View(this, emitter);

      this.particleEmitters2.push(emitterView);

      this.initNode(nodes, nodes[nodeIndex++], emitter, emitterView);
    }

    for (let emitter of model.ribbonEmitters) {
      let emitterView = new RibbonEmitterView(this, emitter);

      this.ribbonEmitters.push(emitterView);

      this.initNode(nodes, nodes[nodeIndex++], emitter, emitterView);
    }

    for (let camera of model.cameras) {
      this.initNode(nodes, nodes[nodeIndex++], camera);
    }

    for (let emitter of model.eventObjects) {
      let emitterView = new EventObjectEmitterView(this, emitter);

      this.eventObjectEmitters.push(emitterView);

      this.initNode(nodes, nodes[nodeIndex++], emitter, emitterView);
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
  }

  /**
   * Clear all of the emitted objects that belong to this instance.
   */
  clearEmittedObjects() {
    if (this.modelView) {
      for (let sceneData of this.modelView.sceneData.values()) {
        for (let emitter of sceneData.particleEmitters) {
          emitter.clear(this);
        }

        for (let emitter of sceneData.particleEmitters2) {
          emitter.clear(this);
        }

        for (let emitter of sceneData.ribbonEmitters) {
          emitter.clear(this);
        }

        for (let emitter of sceneData.eventObjectEmitters) {
          emitter.clear(this);
        }
      }
    }
  }

  /**
   * Initialize a skeletal node.
   *
   * @param {Array<SkeletalNode>} nodes
   * @param {SkeletalNode} node
   * @param {GenericObject} genericObject
   * @param {*} object
   */
  initNode(nodes, node, genericObject, object) {
    node.pivot.set(genericObject.pivot);

    if (genericObject.parentId === -1) {
      node.parent = this;
    } else {
      node.parent = nodes[genericObject.parentId];
    }

    if (genericObject.billboarded) {
      node.billboarded = true;
    } else if (genericObject.billboardedX) {
      node.billboardedX = true;
    } else if (genericObject.billboardedY) {
      node.billboardedY = true;
    } else if (genericObject.billboardedZ) {
      node.billboardedZ = true;
    }

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
   * Overriden to show also attachment models.
   */
  show() {
    super.show();

    for (let attachment of this.attachments) {
      attachment.internalInstance.show();
    }
  }

  /**
   * Updates the animation timers.
   * Emits a 'seqend' event every time a sequence ends.
   */
  updateTimers() {
    if (this.sequence !== -1) {
      let model = this.model;
      let sequence = model.sequences[this.sequence];
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

        this.emit('seqend', this);
      }
    }
  }

  /**
   * Updates all of this instance internal nodes and objects.
   * Nodes that are determined to not be visible will not be updated, nor will any of their children down the hierarchy.
   *
   * @param {boolean} forced
   */
  updateNodes(forced) {
    let sortedNodes = this.sortedNodes;
    let sequence = this.sequence;
    let sortedGenericObjects = this.model.sortedGenericObjects;
    let scene = this.scene;

    // Update the nodes
    for (let i = 0, l = sortedNodes.length; i < l; i++) {
      let genericObject = sortedGenericObjects[i];
      let node = sortedNodes[i];
      let parent = node.parent;

      genericObject.getVisibility(visibilityHeap, this);

      let objectVisible = visibilityHeap[0] >= 0.75;
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
          object.update();
        }

        // Update all of the node's non-skeletal children, which will update their children, and so on.
        node.updateChildren(scene);
      }
    }
  }

  /**
   * Update the batch data.
   *
   * @param {boolean} forced
   */
  updateBatches(forced) {
    let model = this.model;
    let geosets = model.geosets;
    let layers = model.layers;
    let geosetColors = this.geosetColors;
    let layerAlphas = this.layerAlphas;
    let uvOffsets = this.uvOffsets;
    let uvScales = this.uvScales;
    let uvRots = this.uvRots;
    let sequence = this.sequence;

    // Geosets
    for (let i = 0, l = geosets.length; i < l; i++) {
      let geoset = geosets[i];
      let i4 = i * 4;

      // Color
      if (forced || geoset.variants.color[sequence]) {
        geoset.getColor(colorHeap, this);

        // Some Blizzard models have values greater than 1, which messes things up.
        // Geoset animations are supposed to modulate colors, not intensify them.
        geosetColors[i4] = colorHeap[0] * 255;
        geosetColors[i4 + 1] = colorHeap[1] * 255;
        geosetColors[i4 + 2] = colorHeap[2] * 255;
      }

      // Alpha
      if (forced || geoset.variants.alpha[sequence]) {
        geoset.getAlpha(alphaHeap, this);

        geosetColors[i4 + 3] = alphaHeap[0] * 255;
      }
    }

    // Layers
    for (let i = 0, l = layers.length; i < l; i++) {
      let layer = layers[i];
      let i2 = i * 2;
      let i4 = i * 4;

      // Alpha
      if (forced || layer.variants.alpha[sequence]) {
        layer.getAlpha(alphaHeap, this);

        layerAlphas[i] = alphaHeap[0] * 255;
      }

      // UV translation animation
      if (forced || layer.variants.translation[sequence]) {
        layer.getTranslation(translationHeap, this);

        uvOffsets[i4] = translationHeap[0];
        uvOffsets[i4 + 1] = translationHeap[1];
      }

      // UV rotation animation
      if (forced || layer.variants.rotation[sequence]) {
        layer.getRotation(rotationHeap, this);

        uvRots[i2] = rotationHeap[2];
        uvRots[i2 + 1] = rotationHeap[3];
      }

      // UV scale animation
      if (forced || layer.variants.scale[sequence]) {
        layer.getScale(scaleHeap, this);

        uvScales[i] = scaleHeap[0];
      }

      // Sprite animation
      if (forced || layer.variants.slot[sequence]) {
        layer.getTextureId(textureIdHeap, this);

        let uvDivisor = layer.uvDivisor;
        let textureId = textureIdHeap[0];

        uvOffsets[i4 + 2] = textureId % uvDivisor[0];
        uvOffsets[i4 + 3] = (textureId / uvDivisor[1]) | 0;
      }
    }
  }

  /**
   * Update all of the animated data.
   */
  updateAnimations() {
    let forced = this.forced;

    if (forced || (this.sequence !== -1 && !this.model.viewer.noUpdating)) {
      this.forced = false;

      // Update the nodes
      this.updateNodes(forced);

      // Update the batches
      this.updateBatches(forced);
    }
  }

  /**
   * Set the team color of this instance.
   *
   * @param {number} id
   * @return {this}
   */
  setTeamColor(id) {
    this.teamColor = id;

    return this;
  }

  /**
   * Set the vertex color of this instance.
   *
   * @param {Uint8Array|Array<number>} color
   * @return {this}
   */
  setVertexColor(color) {
    this.vertexColor.set(color);

    return this;
  }

  /**
   * Set the sequence of this instance.
   *
   * @param {number} id
   * @return {this}
   */
  setSequence(id) {
    this.sequence = id;

    if (this.model.ok) {
      let sequences = this.model.sequences;

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
   *
   * @param {number} mode
   * @return {this}
   */
  setSequenceLoopMode(mode) {
    this.sequenceLoopMode = mode;

    return this;
  }

  /**
   * Get an attachment node.
   *
   * @param {number} id
   * @return {SkeletalNode}
   */
  getAttachment(id) {
    let attachment = this.model.attachments[id];

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
    for (let eventEmitterView of this.eventObjectEmitters) {
      eventEmitterView.reset();
    }
  }
}
