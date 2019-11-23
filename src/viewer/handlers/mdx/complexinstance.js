import {vec3, quat} from 'gl-matrix';
import ModelInstance from '../../modelinstance';
import {createSkeletalNodes} from '../../node';
import Node from './node';
import AttachmentInstance from './attachmentinstance';
import ParticleEmitter from './particleemitter';
import ParticleEmitter2 from './particleemitter2';
import RibbonEmitter from './ribbonemitter';
import EventObjectSpnEmitter from './eventobjectspnemitter';
import EventObjectSplEmitter from './eventobjectsplemitter';
import EventObjectUbrEmitter from './eventobjectubremitter';
import EventObjectSndEmitter from './eventobjectsndemitter';

// Heap allocations needed for this module.
let visibilityHeap = new Float32Array(1);
let translationHeap = vec3.create();
let rotationHeap = quat.create();
let scaleHeap = vec3.create();
let colorHeap = vec3.create();
let alphaHeap = new Float32Array(1);
let textureIdHeap = new Float32Array(1);

/**
 * An MDX model instance.
 */
export default class MdxComplexInstance extends ModelInstance {
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
  }

  /**
   * Called when the model finishes loading, or immediately if it was already loaded when this instance was created.
   */
  load() {
    let model = this.model;

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

    for (let camera of model.cameras) {
      this.initNode(nodes, nodes[nodeIndex++], camera);
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



    let gl = model.viewer.gl;
    let numberOfBones = model.bones.length + 1;

    this.boneTexture = gl.createTexture();
    this.boneTextureWidth = numberOfBones * 4;
    this.vectorSize = 1 / this.boneTextureWidth;

    gl.activeTexture(gl.TEXTURE15);
    gl.bindTexture(gl.TEXTURE_2D, this.boneTexture);
    model.viewer.webgl.setTextureMode(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.boneTextureWidth, 1, 0, gl.RGBA, gl.FLOAT, null);
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
   *
   * @override
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
   *
   * @param {number} dt
   * @param {boolean} forced
   */
  updateNodes(dt, forced) {
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

  /**
   *
   */
  updateBoneTexture() {
    let gl = this.model.viewer.gl;

    gl.activeTexture(gl.TEXTURE15);
    gl.bindTexture(gl.TEXTURE_2D, this.boneTexture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 4, 0, this.boneTextureWidth - 4, 1, gl.RGBA, gl.FLOAT, this.worldMatrices);
  }


  /**
   * @param {Batch} batch
   * @param {Shader} shader
   */
  renderBatch(batch, shader) {
    let geoset = batch.geoset;
    let layer = batch.layer;
    let geosetIndex = geoset.index;
    let layerIndex = layer.index;
    let geosetColor = this.geosetColors[geosetIndex];
    let layerAlpha = this.layerAlphas[layerIndex];

    if (geosetColor[3] > 0 && layerAlpha > 0) {
      let scene = this.scene;
      let model = this.model;
      let viewer = model.viewer;
      let gl = viewer.gl;
      let uniforms = shader.uniforms;
      let layerTexture = this.layerTextures[layerIndex];
      let uvAnim = this.uvAnims[layerIndex];

      shader.use();

      gl.uniformMatrix4fv(uniforms.u_mvp, false, scene.camera.worldProjectionMatrix);

      gl.uniform4fv(uniforms.u_vertexColor, this.vertexColor);
      gl.uniform4fv(uniforms.u_geosetColor, geosetColor);

      gl.uniform1f(uniforms.u_layerAlpha, layerAlpha);

      gl.uniform2f(uniforms.u_uvTrans, uvAnim[0], uvAnim[1]);
      gl.uniform2f(uniforms.u_uvRot, uvAnim[2], uvAnim[3]);
      gl.uniform1f(uniforms.u_uvScale, uvAnim[4]);

      gl.activeTexture(gl.TEXTURE15);
      gl.bindTexture(gl.TEXTURE_2D, this.boneTexture);
      gl.uniform1i(uniforms.u_boneMap, 15);
      gl.uniform1f(uniforms.u_vectorSize, this.vectorSize);
      gl.uniform1f(uniforms.u_rowSize, 1);

      layer.bind(shader);

      let replaceable = model.replaceables[layerTexture];
      let texture;

      if (replaceable === 1) {
        texture = model.handler.teamColors[this.teamColor];
      } else if (replaceable === 2) {
        texture = model.handler.teamGlows[this.teamColor];
      } else {
        texture = model.textures[layerTexture];
      }

      gl.uniform1i(uniforms.u_texture, 0);
      viewer.webgl.bindTexture(this.textureMapper.get(texture) || texture, 0);

      let shallowGeoset = model.shallowGeosets[geoset.index];

      gl.bindBuffer(gl.ARRAY_BUFFER, model.__webglArrayBuffer);
      shallowGeoset.bind(shader, layer.coordId); // Vertices.

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.__webglElementBuffer);
      shallowGeoset.render();
    }
  }

  /**
   * @override
   */
  renderOpaque() {
    this.model.groups[0].render(this);
  }

  /**
   * @override
   */
  renderTranslucent() {
    let groups = this.model.groups;

    for (let i = 1, l = groups.length; i < l; i++) {
      groups[i].render(this);
    }
  }

  /**
   * Update all of the animated data.
   *
   * @override
   * @param {number} dt
   */
  updateAnimations(dt) {
    let sequenceId = this.sequence;
    let model = this.model;

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
    /// TODO: Update this.
    // for (let eventEmitterView of this.eventObjectEmitters) {
    //   eventEmitterView.reset();
    // }
  }
}
