import {extentToSphere} from '../../../common/bounds';
import Parser from '../../../parsers/mdlx/model';
import TexturedModel from '../../texturedmodel';
import TextureAnimation from './textureanimation';
import Layer from './layer';
import GeosetAnimation from './geosetanimation';
import {Geoset} from './geoset';
import Batch from './batch';
import {ShallowGeoset} from './geoset';
import replaceableIds from './replaceableids';
import Bone from './bone';
import Light from './light';
import Helper from './helper';
import Attachment from './attachment';
import ParticleEmitter from './modelparticleemitter';
import ParticleEmitter2 from './modelparticleemitter2';
import RibbonEmitter from './modelribbonemitter';
import Camera from './camera';
import EventObject from './modeleventobject';
import CollisionShape from './collisionshape';
/**
 * An MDX model.
 */
export default class Model extends TexturedModel {
  /**
   * @param {Object} resourceData
   */
  constructor(resourceData) {
    super(resourceData);

    this.parser = null;
    this.name = '';
    this.extent = null;
    this.bounds = null;
    this.sequences = [];
    this.globalSequences = [];
    this.materials = [];
    this.layers = [];
    this.textures = [];
    this.textureAnimations = [];
    this.geosets = [];
    this.geosetAnimations = [];
    this.bones = [];
    this.lights = [];
    this.helpers = [];
    this.attachments = [];
    this.pivotPoints = [];
    this.particleEmitters = [];
    this.particleEmitters2 = [];
    this.ribbonEmitters = [];
    this.cameras = [];
    this.eventObjects = [];
    this.collisionShapes = [];

    this.hasLayerAnims = false;
    this.hasGeosetAnims = false;
    this.batches = [];
    this.opaqueBatches = [];
    this.translucentBatches = [];

    this.genericObjects = [];
    this.sortedGenericObjects = [];
    this.hierarchy = [];
    this.replaceables = [];
  }

  /**
   * @param {ArrayBuffer|string} buffer
   */
  load(buffer) {
    // Parsing
    let parser = new Parser();

    parser.load(buffer);

    this.parser = parser;

    // Model
    this.name = parser.name;

    // Make a bounding sphere from the model extent.
    let extent = parser.extent;
    this.bounds = extentToSphere(extent.min, extent.max);
    this.extent = extent;

    // Sequences
    for (let sequence of parser.sequences) {
      this.sequences.push(sequence);
    }

    // Global sequences
    for (let globalSequence of parser.globalSequences) {
      this.globalSequences.push(globalSequence);
    }

    let usingTeamTextures = false;

    // Textures
    for (let texture of parser.textures) {
      let path = texture.path;
      let replaceableId = texture.replaceableId;
      let flags = texture.flags;

      if (replaceableId !== 0) {
        path = `ReplaceableTextures\\${replaceableIds[replaceableId]}.blp`;

        if (replaceableId === 1 || replaceableId === 2) {
          usingTeamTextures = true;
        }
      }

      // If the path is corrupted, try to fix it.
      if (!path.endsWith('.blp') && !path.endsWith('.tga')) {
        // Try to search for .blp
        let index = path.indexOf('.blp');

        if (index === -1) {
          // Not a .blp, try to search for .tga
          index = path.indexOf('.tga');
        }

        if (index !== -1) {
          // Hopefully fix the path
          path = path.slice(0, index + 4);
        }
      }

      this.replaceables.push(replaceableId);

      let textureRes = this.viewer.load(path, this.pathSolver);

      textureRes.wrapS = !!(flags & 0x1);
      textureRes.wrapT = !!(flags & 0x2);

      this.textures.push(textureRes);
    }

    if (usingTeamTextures) {
      // Start loading the team color and glow textures.
      this.loadTeamTextures();
    }

    // Texture animations
    for (let textureAnimation of parser.textureAnimations) {
      this.textureAnimations.push(new TextureAnimation(this, textureAnimation));
    }

    // Materials
    let layerId = 0;
    for (let material of parser.materials) {
      let vMaterial = [];

      for (let layer of material.layers) {
        let vLayer = new Layer(this, layer, layerId++, material.priorityPlane);

        vMaterial.push(vLayer);
        this.layers.push(vLayer);

        if (vLayer.hasAnim) {
          this.hasLayerAnims = true;
        }
      }

      this.materials.push(vMaterial);
    }

    // Geoset animations
    for (let geosetAnimation of parser.geosetAnimations) {
      this.geosetAnimations.push(new GeosetAnimation(this, geosetAnimation));
    }

    // Geosets
    if (parser.geosets.length) {
      let geosetId = 0;
      let batchId = 0;
      let opaqueBatches = [];
      let translucentBatches = [];

      for (let geoset of parser.geosets) {
        let vGeoset = new Geoset(this, geoset, geosetId++);

        if (vGeoset.hasAnim) {
          this.hasGeosetAnims = true;
        }

        this.geosets.push(vGeoset);

        // Batches
        for (let vLayer of this.materials[geoset.materialId]) {
          let batch = new Batch(batchId++, vLayer, vGeoset);

          if (vLayer.filterMode < 2) {
            opaqueBatches.push(batch);
          } else {
            translucentBatches.push(batch);
          }
        }
      }

      // / TODO: I don't remember if this is actually needed, are the layers ever not sorted?
      translucentBatches.sort((a, b) => a.layer.priorityPlane - b.layer.priorityPlane);

      this.opaqueBatches.push(...opaqueBatches);
      this.translucentBatches.push(...translucentBatches);
      this.batches.push(...opaqueBatches, ...translucentBatches);

      this.setupGeosets();
    }

    this.pivotPoints = parser.pivotPoints;

    // Tracks the IDs of all generic objects.
    let objectId = 0;

    // Bones
    for (let bone of parser.bones) {
      this.bones.push(new Bone(this, bone, objectId++));
    }

    // Lights
    for (let light of parser.lights) {
      this.lights.push(new Light(this, light, objectId++));
    }

    // Helpers
    for (let helper of parser.helpers) {
      this.helpers.push(new Helper(this, helper, objectId++));
    }

    // Attachments
    for (let attachment of parser.attachments) {
      this.attachments.push(new Attachment(this, attachment, objectId++));
    }

    // Particle emitters
    for (let particleEmitter of parser.particleEmitters) {
      this.particleEmitters.push(new ParticleEmitter(this, particleEmitter, objectId++));
    }

    // Particle emitters 2
    for (let particleEmitter2 of parser.particleEmitters2) {
      this.particleEmitters2.push(new ParticleEmitter2(this, particleEmitter2, objectId++));
    }

    // E.g. Wisp
    this.particleEmitters2.sort((a, b) => a.priorityPlane - b.priorityPlane);


    // Ribbon emitters
    for (let ribbonEmitter of parser.ribbonEmitters) {
      this.ribbonEmitters.push(new RibbonEmitter(this, ribbonEmitter, objectId++));
    }

    // Cameras
    for (let camera of parser.cameras) {
      this.cameras.push(new Camera(this, camera, objectId++));
    }

    // Event objects
    for (let eventObject of parser.eventObjects) {
      this.eventObjects.push(new EventObject(this, eventObject, objectId++));
    }

    // Collision shapes
    for (let collisionShape of parser.collisionShapes) {
      this.collisionShapes.push(new CollisionShape(this, collisionShape, objectId++));
    }

    // One array for all generic objects.
    this.genericObjects.push(...this.bones, ...this.lights, ...this.helpers, ...this.attachments, ...this.particleEmitters, ...this.particleEmitters2, ...this.ribbonEmitters, ...this.cameras, ...this.eventObjects, ...this.collisionShapes);

    // Creates the sorted indices array of the generic objects.
    this.setupHierarchy(-1);

    // Keep a sorted array.
    for (let i = 0, l = this.genericObjects.length; i < l; i++) {
      this.sortedGenericObjects[i] = this.genericObjects[this.hierarchy[i]];
    }

    // Checks what sequences are variant or not.
    this.setupVariants();

    // this.calculateExtent();
  }

  /**
   *
   */
  loadTeamTextures() {
    let viewer = this.viewer;

    if (!viewer.getTextureAtlas('teamColors')) {
      let pathSolver = this.pathSolver;
      let teamColors = [];
      let teamGlows = [];

      for (let i = 0; i < 14; i++) {
        let id = ('' + i).padStart(2, '0');

        teamColors[i] = viewer.load(`ReplaceableTextures\\TeamColor\\TeamColor${id}.blp`, pathSolver);
        teamGlows[i] = viewer.load(`ReplaceableTextures\\TeamGlow\\TeamGlow${id}.blp`, pathSolver);
      }

      viewer.loadTextureAtlas('teamColors', teamColors);
      viewer.loadTextureAtlas('teamGlows', teamGlows);
    }
  }

  /**
   * @param {number} sequence
   * @return {boolean}
   */
  isVariant(sequence) {
    let genericObjects = this.genericObjects;

    for (let i = 0, l = genericObjects.length; i < l; i++) {
      if (genericObjects[i].variants.generic[sequence]) {
        return true;
      }
    }

    return false;
  }

  /**
   *
   */
  setupVariants() {
    let variants = [];

    for (let i = 0, l = this.sequences.length; i < l; i++) {
      variants[i] = this.isVariant(i);
    }

    this.variants = variants;
  }

  /**
   *
   */
  setupGeosets() {
    let geosets = this.geosets;

    if (geosets.length > 0) {
      let gl = this.viewer.gl;
      let shallowGeosets = [];
      let typedArrays = [];
      let totalArrayOffset = 0;
      let elementTypedArrays = [];
      let totalElementOffset = 0;

      for (let i = 0, l = geosets.length; i < l; i++) {
        let geoset = geosets[i];
        let vertices = geoset.locationArray;
        let normals = geoset.normalArray;
        let uvSets = geoset.uvsArray;
        let boneIndices = geoset.boneIndexArray;
        let boneNumbers = geoset.boneNumberArray;
        let faces = geoset.faceArray;
        let verticesOffset = totalArrayOffset;
        let normalsOffset = verticesOffset + vertices.byteLength;
        let uvSetsOffset = normalsOffset + normals.byteLength;
        let boneIndicesOffset = uvSetsOffset + uvSets.byteLength;
        let boneNumbersOffset = boneIndicesOffset + boneIndices.byteLength;

        shallowGeosets[i] = new ShallowGeoset(this, [verticesOffset, normalsOffset, uvSetsOffset, boneIndicesOffset, boneNumbersOffset, totalElementOffset], geoset.uvSetSize, faces.length);

        typedArrays.push([verticesOffset, vertices]);
        typedArrays.push([normalsOffset, normals]);
        typedArrays.push([uvSetsOffset, uvSets]);
        typedArrays.push([boneIndicesOffset, boneIndices]);
        typedArrays.push([boneNumbersOffset, boneNumbers]);

        elementTypedArrays.push([totalElementOffset, faces]);

        totalArrayOffset = boneNumbersOffset + boneNumbers.byteLength;
        totalElementOffset += faces.byteLength;
      }

      let arrayBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, totalArrayOffset, gl.STATIC_DRAW);

      for (let i = 0, l = typedArrays.length; i < l; i++) {
        gl.bufferSubData(gl.ARRAY_BUFFER, typedArrays[i][0], typedArrays[i][1]);
      }

      let faceBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, totalElementOffset, gl.STATIC_DRAW);

      for (let i = 0, l = elementTypedArrays.length; i < l; i++) {
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, elementTypedArrays[i][0], elementTypedArrays[i][1]);
      }

      this.__webglArrayBuffer = arrayBuffer;
      this.__webglElementBuffer = faceBuffer;
      this.shallowGeosets = shallowGeosets;
    }
  }

  /**
   * @param {number} parent
   */
  setupHierarchy(parent) {
    for (let i = 0, l = this.genericObjects.length; i < l; i++) {
      let object = this.genericObjects[i];

      if (object.parentId === parent) {
        this.hierarchy.push(i);

        this.setupHierarchy(object.objectId);
      }
    }
  }

  /**
   * @param {Bucket} bucket
   * @param {Scene} scene
   */
  bind(bucket, scene) {
    const webgl = this.viewer.webgl;
    let gl = this.viewer.gl;

    // HACK UNTIL I IMPLEMENT MULTIPLE SHADERS AGAIN

    let shader = this.viewer.shaderMap.get('MdxStandardShader');
    webgl.useShaderProgram(shader);
    this.shader = shader;

    const instancedArrays = gl.extensions.instancedArrays;
    const attribs = shader.attribs;
    const uniforms = shader.uniforms;

    gl.uniformMatrix4fv(uniforms.u_mvp, false, scene.camera.worldProjectionMatrix);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.__webglElementBuffer);

    gl.uniform1i(uniforms.u_texture, 0);


    // Team and vertex colors.
    let teamColor = attribs.a_teamColor;
    let vertexColor = attribs.a_vertexColor;
    gl.bindBuffer(gl.ARRAY_BUFFER, bucket.colorBuffer);
    gl.vertexAttribPointer(teamColor, 1, gl.UNSIGNED_BYTE, false, 5, 0);
    gl.vertexAttribPointer(vertexColor, 4, gl.UNSIGNED_BYTE, true, 5, 1); // normalize the colors from [0, 255] to [0, 1] here instead of in the pixel shader

    gl.activeTexture(gl.TEXTURE15);
    gl.bindTexture(gl.TEXTURE_2D, bucket.boneTexture);
    gl.uniform1i(uniforms.u_boneMap, 15);
    gl.uniform1f(uniforms.u_vectorSize, bucket.vectorSize);
    gl.uniform1f(uniforms.u_rowSize, bucket.rowSize);

    let instanceId = attribs.a_InstanceID;
    gl.bindBuffer(gl.ARRAY_BUFFER, bucket.instanceIdBuffer);
    gl.vertexAttribPointer(instanceId, 1, gl.UNSIGNED_SHORT, false, 0, 0);

    instancedArrays.vertexAttribDivisorANGLE(teamColor, 1);
    instancedArrays.vertexAttribDivisorANGLE(vertexColor, 1);
    instancedArrays.vertexAttribDivisorANGLE(instanceId, 1);
  }

  /**
   *
   */
  unbind() {
    let gl = this.viewer.gl;
    let instancedArrays = gl.extensions.instancedArrays;
    let attribs = this.shader.attribs;

    // Reset gl values to default, to play nice with other handlers
    gl.depthMask(1);
    gl.disable(gl.BLEND);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Reset the attributes to play nice with other handlers
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_teamColor, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_vertexColor, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_InstanceID, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_geosetColor, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_layerAlpha, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.uvTransRot, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.uvScaleSprite, 0);
  }

  /**
   * @param {Bucket} bucket
   * @param {Batch} batch
   */
  renderBatch(bucket, batch) {
    let gl = this.viewer.gl;
    let instancedArrays = gl.extensions.instancedArrays;
    let shader = this.shader;
    let attribs = this.shader.attribs;
    let uniforms = shader.uniforms;
    let geoset = batch.geoset;
    let layer = batch.layer;
    let shallowGeoset = this.shallowGeosets[geoset.index];
    let replaceable = this.replaceables[layer.textureId];

    layer.bind(shader);

    let texture;
    let isTeamColor = false;

    if (replaceable === 1) {
      texture = this.viewer.getTextureAtlas('teamColors');
      isTeamColor = true;
    } else if (replaceable === 2) {
      texture = this.viewer.getTextureAtlas('teamGlows');
      isTeamColor = true;
    } else {
      texture = this.textures[layer.textureId];
    }

    gl.uniform1f(uniforms.u_isTeamColor, isTeamColor);
    gl.uniform1f(uniforms.u_hasSlotAnim, layer.hasSlotAnim);
    gl.uniform1f(uniforms.u_hasTranslationAnim, layer.hasTranslationAnim);
    gl.uniform1f(uniforms.u_hasRotationAnim, layer.hasRotationAnim);
    gl.uniform1f(uniforms.u_hasScaleAnim, layer.hasScaleAnim);

    // Texture coordinate divisor
    // Used for layers that use image animations, in order to scale the coordinates to match the generated texture atlas
    gl.uniform2f(uniforms.u_uvScale, 1 / layer.uvDivisor[0], 1 / layer.uvDivisor[1]);

    this.bindTexture(texture, 0, bucket.modelView);

    let geosetColor = attribs.a_geosetColor;
    let uvTransRot = attribs.a_uvTransRot;
    let uvScaleSprite = attribs.a_uvScaleSprite;
    let layerAlpha = attribs.a_layerAlpha;

    instancedArrays.vertexAttribDivisorANGLE(geosetColor, 1);
    instancedArrays.vertexAttribDivisorANGLE(uvTransRot, 1);
    instancedArrays.vertexAttribDivisorANGLE(uvScaleSprite, 1);
    instancedArrays.vertexAttribDivisorANGLE(layerAlpha, 1);

    gl.bindBuffer(gl.ARRAY_BUFFER, bucket.geosetColorsBuffer);
    // Geoset colors.
    gl.vertexAttribPointer(geosetColor, 4, gl.UNSIGNED_BYTE, true, 4, this.batchSize * geoset.index * 4);


    gl.bindBuffer(gl.ARRAY_BUFFER, bucket.layersBuffer);
    // Texture animations.
    gl.vertexAttribPointer(uvTransRot, 4, gl.FLOAT, false, 28, this.batchSize * 7 * layer.index * 4);
    gl.vertexAttribPointer(uvScaleSprite, 3, gl.FLOAT, false, 28, this.batchSize * 7 * layer.index * 4 + 16);
    // Layer alphas.
    gl.vertexAttribPointer(layerAlpha, 1, gl.UNSIGNED_BYTE, true, 1, bucket.layerAlphasData.byteOffset + this.batchSize * layer.index);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.__webglArrayBuffer);
    // Vertices.
    shallowGeoset.bind(shader, layer.coordId);

    shallowGeoset.render(bucket.count);
  }

  /**
   * @param {Bucket} bucket
   * @param {Scene} scene
   * @param {Array<Batch>} batches
   */
  renderBatches(bucket, scene, batches) {
    if (batches && batches.length) {
      this.bind(bucket, scene);

      for (let i = 0, l = batches.length; i < l; i++) {
        this.renderBatch(bucket, batches[i]);
      }

      this.unbind();
    }
  }

  /**
   * Render the opaque things in the given scene data.
   *
   * @param {Object} data
   */
  renderOpaque(data) {
    let scene = data.scene;

    for (let bucket of data.buckets) {
      if (bucket.count) {
        this.renderBatches(bucket, scene, this.opaqueBatches);
      }
    }
  }

  /**
   * Render the translucent things in the given scene data.
   *
   * @param {Object} data
   */
  renderTranslucent(data) {
    let scene = data.scene;
    let modelView = data.modelView;
    let buckets = data.buckets;
    let particleEmitters2 = data.particleEmitters2;
    let ribbonEmitters = data.ribbonEmitters;
    let eventObjectEmitters = data.eventObjectEmitters;

    // Batches
    for (let bucket of buckets) {
      if (bucket.count) {
        this.renderBatches(bucket, scene, this.translucentBatches);
      }
    }

    // Emitters
    if (particleEmitters2.length || eventObjectEmitters.length || ribbonEmitters.length) {
      let webgl = this.viewer.webgl;
      let gl = this.viewer.gl;

      gl.depthMask(0);
      gl.enable(gl.BLEND);
      gl.disable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);

      let shader = this.viewer.shaderMap.get('MdxParticleShader');
      webgl.useShaderProgram(shader);

      gl.uniformMatrix4fv(shader.uniforms.u_mvp, false, scene.camera.worldProjectionMatrix);

      gl.uniform1i(shader.uniforms.u_texture, 0);

      gl.uniform1f(shader.uniforms.u_isRibbonEmitter, false);

      for (let i = 0, l = particleEmitters2.length; i < l; i++) {
        particleEmitters2[i].render(modelView, shader);
      }

      for (let i = 0, l = eventObjectEmitters.length; i < l; i++) {
        eventObjectEmitters[i].render(modelView, shader);
      }

      gl.uniform1f(shader.uniforms.u_isRibbonEmitter, true);

      for (let i = 0, l = ribbonEmitters.length; i < l; i++) {
        ribbonEmitters[i].render(modelView, shader);
      }
    }
  }
}
