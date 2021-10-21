import { vec3, quat } from 'gl-matrix';
import ModelInstance from '../../modelinstance';
import { createSkeletalNodes, SkeletalNode } from '../../skeletalnode';
import DataTexture from '../../gl/datatexture';
import Texture from '../../texture';
import MdxNode from './node';
import AttachmentInstance from './attachmentinstance';
import ParticleEmitter from './particleemitter';
import ParticleEmitter2 from './particleemitter2';
import RibbonEmitter from './ribbonemitter';
import EventObjectEmitter from './eventobjectemitter';
import EventObjectSpnEmitter from './eventobjectspnemitter';
import EventObjectSplEmitter from './eventobjectsplemitter';
import EventObjectUbrEmitter from './eventobjectubremitter';
import EventObjectSndEmitter from './eventobjectsndemitter';
import MdxModel from './model';
import GenericObject from './genericobject';
import { EMITTER_PARTICLE2_TEXTURE_OFFSET, EMITTER_EVENT_TEXTURE_OFFSET } from './geometryemitterfuncs';
import Bounds from '../../bounds';

const visibilityHeap = new Float32Array(1);
const translationHeap = vec3.create();
const rotationHeap = quat.create();
const scaleHeap = vec3.create();
const colorHeap = new Float32Array(3);
const alphaHeap = new Float32Array(1);
const textureIdHeap = new Uint32Array(1);

type SkeletalNodeObject = AttachmentInstance | ParticleEmitter | ParticleEmitter2 | RibbonEmitter | EventObjectEmitter;

/**
 * An MDX model instance.
 */
export default class MdxModelInstance extends ModelInstance {
  attachments: AttachmentInstance[] = [];
  particleEmitters: ParticleEmitter[] = [];
  particleEmitters2: ParticleEmitter2[] = [];
  ribbonEmitters: RibbonEmitter[] = [];
  eventObjectEmitters: (EventObjectSpnEmitter | EventObjectSplEmitter | EventObjectUbrEmitter | EventObjectSndEmitter)[] = [];
  nodes: SkeletalNode[] = [];
  sortedNodes: SkeletalNode[] = [];
  frame = 0;
  // Global sequences
  counter = 0;
  sequence = -1;
  sequenceLoopMode = 0;
  sequenceEnded = false;
  teamColor = 0;
  vertexColor = new Float32Array([1, 1, 1, 1]);
  // Particles do not spawn when the sequence is -1, or when the sequence finished and it's not repeating
  allowParticleSpawn = false;
  // If forced is true, everything will update regardless of variancy.
  // Any later non-forced update can then use variancy to skip updating things.
  // It is set to true every time the sequence is set with setSequence().
  forced = true;
  geosetColors: Float32Array[] = [];
  layerAlphas: number[] = [];
  layerTextures: number[] = [];
  uvAnims: Float32Array[] = [];
  worldMatrices: Float32Array | null = null;
  boneTexture: DataTexture | null = null;

  constructor(model: MdxModel) {
    super(model);

    for (let i = 0, l = model.geosets.length; i < l; i++) {
      this.geosetColors[i] = new Float32Array(4);
    }

    for (let i = 0, l = model.layers.length; i < l; i++) {
      this.layerAlphas[i] = 0;
      this.layerTextures[i] = 0;
      this.uvAnims[i] = new Float32Array(5);
    }

    // Create the needed amount of shared nodes.
    const sharedNodeData = createSkeletalNodes(model.genericObjects.length, MdxNode);
    const nodes = sharedNodeData.nodes;
    let nodeIndex = 0;

    this.nodes.push(...nodes);

    // A shared typed array for all world matrices of the internal nodes.
    this.worldMatrices = sharedNodeData.worldMatrices;

    // And now initialize all of the nodes and objects
    for (const bone of model.bones) {
      this.initNode(nodes, nodes[nodeIndex++], bone);
    }

    for (const light of model.lights) {
      this.initNode(nodes, nodes[nodeIndex++], light);
    }

    for (const helper of model.helpers) {
      this.initNode(nodes, nodes[nodeIndex++], helper);
    }

    for (const attachment of model.attachments) {
      let attachmentInstance;

      // Attachments may have game models attached to them, such as Undead and Nightelf building animations.
      if (attachment.internalModel) {
        attachmentInstance = new AttachmentInstance(this, attachment);

        this.attachments.push(attachmentInstance);
      }

      this.initNode(nodes, nodes[nodeIndex++], attachment, attachmentInstance);
    }

    for (const emitterObject of model.particleEmitters) {
      const emitter = new ParticleEmitter(this, emitterObject);

      this.particleEmitters.push(emitter);

      this.initNode(nodes, nodes[nodeIndex++], emitterObject, emitter);
    }

    for (const emitterObject of model.particleEmitters2) {
      const emitter = new ParticleEmitter2(this, emitterObject);

      this.particleEmitters2.push(emitter);

      this.initNode(nodes, nodes[nodeIndex++], emitterObject, emitter);
    }

    for (const emitterObject of model.ribbonEmitters) {
      const emitter = new RibbonEmitter(this, emitterObject);

      this.ribbonEmitters.push(emitter);

      this.initNode(nodes, nodes[nodeIndex++], emitterObject, emitter);
    }

    for (const emitterObject of model.eventObjects) {
      const type = emitterObject.type;
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

    for (const collisionShape of model.collisionShapes) {
      this.initNode(nodes, nodes[nodeIndex++], collisionShape);
    }

    // Save a sorted array of all of the nodes, such that every child node comes after its parent.
    // This allows for flat iteration when updating.
    const hierarchy = model.hierarchy;

    for (let i = 0, l = nodes.length; i < l; i++) {
      this.sortedNodes[i] = nodes[hierarchy[i]];
    }

    if (model.bones.length) {
      this.boneTexture = new DataTexture(model.viewer.gl, 4, model.bones.length * 4, 1);
    }
  }


  /**
   * Override the texture at the given index.
   * 
   * If a texture isn't given, removes the override if there was one.
   */
  setTexture(index: number, texture?: Texture): void {
    this.overrideTexture(index, texture);
  }

  /**
   * Override the texture of the particle emitter the given index.
   * 
   * If a texture isn't given, removes the override if there was one.
   */
  setParticle2Texture(index: number, texture?: Texture): void {
    this.overrideTexture(EMITTER_PARTICLE2_TEXTURE_OFFSET + index, texture);
  }

  /**
   * Override the texture of the event emitter the given index.
   * 
   * If a texture isn't given, removes the override if there was one.
   */
  setEventTexture(index: number, texture?: Texture): void {
    this.overrideTexture(EMITTER_EVENT_TEXTURE_OFFSET + index, texture);
  }

  /**
   * Clear all of the emitted objects that belong to this instance.
   */
  override clearEmittedObjects(): void {
    for (const emitter of this.particleEmitters) {
      emitter.clear();
    }

    for (const emitter of this.particleEmitters2) {
      emitter.clear();
    }

    for (const emitter of this.ribbonEmitters) {
      emitter.clear();
    }

    for (const emitter of this.eventObjectEmitters) {
      emitter.clear();
    }
  }

  /**
   * Initialize a skeletal node.
   */
  initNode(nodes: SkeletalNode[], node: SkeletalNode, genericObject: GenericObject, object?: SkeletalNodeObject): void {
    vec3.copy(node.pivot, genericObject.pivot);

    if (genericObject.parentId === -1) {
      node.parent = this;
    } else {
      node.parent = nodes[genericObject.parentId];
    }

    node.dontInheritTranslation = genericObject.dontInheritTranslation;
    node.dontInheritRotation = genericObject.dontInheritRotation;
    node.dontInheritScaling = genericObject.dontInheritScaling;
    
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
  override hide(): void {
    super.hide();

    this.resetAttachments();
  }

  /**
   * Updates all of this instance internal nodes and objects.
   * Nodes that are determined to not be visible will not be updated, nor will any of their children down the hierarchy.
   */
  updateNodes(dt: number, forced: boolean): void {
    const sequence = this.sequence;
    const frame = this.frame;
    const counter = this.counter;
    const sortedNodes = this.sortedNodes;
    const model = <MdxModel>this.model;
    const sortedGenericObjects = model.sortedGenericObjects;

    // Update the nodes
    for (let i = 0, l = sortedNodes.length; i < l; i++) {
      const genericObject = sortedGenericObjects[i];
      const node = sortedNodes[i];
      const parent = <MdxNode | SkeletalNode>node.parent;
      let wasDirty = forced || parent.wasDirty || genericObject.anyBillboarding;
      const variants = genericObject.variants;

      // Local node transformation.
      // Use variants to skip animation data when possible.
      if (forced || variants['generic'][sequence]) {
        wasDirty = true;

        // Translation
        if (forced || variants['translation'][sequence]) {
          genericObject.getTranslation(node.localLocation, sequence, frame, counter);
        }

        // Rotation
        if (forced || variants['rotation'][sequence]) {
          genericObject.getRotation(node.localRotation, sequence, frame, counter);
        }

        // Scale
        if (forced || variants['scale'][sequence]) {
          genericObject.getScale(node.localScale, sequence, frame, counter);
        }
      }

      node.wasDirty = wasDirty;

      // If this is a forced update, or this node's local data was updated, or the parent node was updated, do a full world update.
      if (wasDirty) {
        node.recalculateTransformation(this);
      }

      // If there is an instance object associated with this node (emitter/attachment), and it is visible, update it.
      if (node.object) {
        genericObject.getVisibility(visibilityHeap, sequence, frame, counter);

        // If the attachment/emitter is visible, update it.
        if (visibilityHeap[0] > 0) {
          (<SkeletalNodeObject>node.object).update(dt);
        }
      }

      // Recalculate and update child nodes.
      // Note that this only affects normal nodes such as instances, and not skeletal nodes.
      for (const child of node.children) {
        if (wasDirty) {
          child.recalculateTransformation();
        }

        child.update(dt);
      }
    }
  }

  /**
   * If a model has no sequences or is running no sequence, it will only update once since it will never be forced to update.
   * This is generally the desired behavior, except when it is moved by the client.
   * Therefore, if an instance is transformed, always do a forced update.
   */
  override recalculateTransformation(): void {
    super.recalculateTransformation();

    this.forced = true;
  }

  /**
   * Update the batch data.
   */
  updateBatches(forced: boolean): void {
    const sequence = this.sequence;
    const frame = this.frame;
    const counter = this.counter;
    const model = <MdxModel>this.model;
    const geosets = model.geosets;
    const layers = model.layers;
    const geosetColors = this.geosetColors;
    const layerAlphas = this.layerAlphas;
    const layerTextures = this.layerTextures;
    const uvAnims = this.uvAnims;

    // Geosets
    for (let i = 0, l = geosets.length; i < l; i++) {
      const geoset = geosets[i];
      const geosetAnimation = geoset.geosetAnimation;
      const geosetColor = geosetColors[i];

      if (geosetAnimation) {
        // Color
        if (forced || geosetAnimation.variants['color'][sequence]) {
          geosetAnimation.getColor(colorHeap, sequence, frame, counter);

          geosetColor[0] = colorHeap[0];
          geosetColor[1] = colorHeap[1];
          geosetColor[2] = colorHeap[2];
        }

        // Alpha
        if (forced || geosetAnimation.variants['alpha'][sequence]) {
          geosetAnimation.getAlpha(alphaHeap, sequence, frame, counter);

          geosetColor[3] = alphaHeap[0];
        }
      } else if (forced) {
        geosetColor[0] = 1;
        geosetColor[1] = 1;
        geosetColor[2] = 1;
        geosetColor[3] = 1;
      }
    }

    // Layers
    for (let i = 0, l = layers.length; i < l; i++) {
      const layer = layers[i];
      const textureAnimation = layer.textureAnimation;
      const uvAnim = uvAnims[i];

      // Alpha
      if (forced || layer.variants['alpha'][sequence]) {
        layer.getAlpha(alphaHeap, sequence, frame, counter);

        layerAlphas[i] = alphaHeap[0];
      }

      // Sprite animation
      if (forced || layer.variants['textureId'][sequence]) {
        layer.getTextureId(textureIdHeap, sequence, frame, counter);

        layerTextures[i] = textureIdHeap[0];
      }

      if (textureAnimation) {
        // UV translation animation
        if (forced || textureAnimation.variants['translation'][sequence]) {
          textureAnimation.getTranslation(<Float32Array>translationHeap, sequence, frame, counter);

          uvAnim[0] = translationHeap[0];
          uvAnim[1] = translationHeap[1];
        }

        // UV rotation animation
        if (forced || textureAnimation.variants['rotation'][sequence]) {
          textureAnimation.getRotation(<Float32Array>rotationHeap, sequence, frame, counter);

          uvAnim[2] = rotationHeap[2];
          uvAnim[3] = rotationHeap[3];
        }

        // UV scale animation
        if (forced || textureAnimation.variants['scale'][sequence]) {
          textureAnimation.getScale(<Float32Array>scaleHeap, sequence, frame, counter);

          uvAnim[4] = scaleHeap[0];
        }
      } else if (forced) {
        uvAnim[0] = 0;
        uvAnim[1] = 0;
        uvAnim[2] = 0;
        uvAnim[3] = 1;
        uvAnim[4] = 1;
      }
    }
  }

  updateBoneTexture(): void {
    if (this.boneTexture) {
      this.boneTexture.bindAndUpdate(<Float32Array>this.worldMatrices);
    }
  }

  override renderOpaque(): void {
    const model = <MdxModel>this.model;

    for (const group of model.opaqueGroups) {
      group.render(this);
    }
  }

  override renderTranslucent(): void {
    const model = <MdxModel>this.model;

    for (const group of model.translucentGroups) {
      group.render(this);
    }
  }

  override updateAnimations(dt: number): void {
    const model = <MdxModel>this.model;
    const sequenceId = this.sequence;

    if (sequenceId !== -1) {
      const sequence = model.sequences[sequenceId];
      const interval = sequence.interval;
      const frameTime = dt * 1000;

      this.frame += frameTime;
      this.counter += frameTime;
      this.allowParticleSpawn = true;

      if (this.frame >= interval[1]) {
        if (this.sequenceLoopMode === 2 || (this.sequenceLoopMode === 0 && sequence.nonLooping === 0)) {
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

    const forced = this.forced;

    if (sequenceId !== -1 || forced) {
      // Update the nodes
      this.updateNodes(dt, forced);

      // Update the bone texture.
      this.updateBoneTexture();

      // Update the batches
      this.updateBatches(forced);
    }

    this.forced = false;
  }

  /**
   * Set the team color of this instance.
   */
  setTeamColor(id: number): this {
    this.teamColor = id;

    return this;
  }

  /**
   * Set the vertex color of this instance.
   */
  setVertexColor(color: Float32Array | number[]): this {
    this.vertexColor.set(color);

    return this;
  }

  /**
   * Set the sequence of this instance.
   */
  setSequence(id: number): this {
    const model = <MdxModel>this.model;
    const sequences = model.sequences;

    this.sequence = id;

    if (id < 0 || id > sequences.length - 1) {
      this.sequence = -1;
      this.frame = 0;
      this.allowParticleSpawn = false;
    } else {
      this.frame = sequences[id].interval[0];
    }

    this.resetEventEmitters();
    this.resetAttachments();

    this.forced = true;

    return this;
  }

  override getBounds(): Bounds {
    const model = <MdxModel>this.model;

    if (this.sequence === -1) {
      return model.bounds;
    }

    const bounds = model.sequences[this.sequence].bounds;

    if (bounds.r === 0) {
      return model.bounds;
    }

    return bounds;
  }

  /**
   * Set the sequence loop mode.
   * 0 to never loop, 1 to loop based on the model, and 2 to always loop.
   */
  setSequenceLoopMode(mode: number): this {
    this.sequenceLoopMode = mode;

    return this;
  }

  /**
   * Get an attachment node.
   */
  getAttachment(id: number): SkeletalNode | undefined {
    const model = <MdxModel>this.model;
    const attachment = model.attachments[id];

    if (attachment) {
      return this.nodes[attachment.index];
    }

    return;
  }

  resetEventEmitters(): void {
    for (const emitter of this.eventObjectEmitters) {
      emitter.lastValue = 0;
    }
  }

  resetAttachments(): void {
    for (const attachment of this.attachments) {
      attachment.internalInstance.hide();
    }
  }
}
