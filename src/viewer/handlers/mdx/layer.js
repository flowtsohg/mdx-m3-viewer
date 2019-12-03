import {vec3, quat} from 'gl-matrix';
import {VEC3_ZERO, VEC3_ONE, QUAT_DEFAULT} from '../../../common/gl-matrix-addon';
import AnimatedObject from './animatedobject';
import {layerFilterMode} from './filtermode';

/**
 * An MDX layer.
 */
export default class Layer extends AnimatedObject {
  /**
   * @param {Model} model
   * @param {ModelViewer.parser.mdlx.Layer} layer
   * @param {number} layerId
   * @param {number} priorityPlane
   */
  constructor(model, layer, layerId, priorityPlane) {
    super(model, layer);

    let filterMode = layer.filterMode;
    let textureAnimationId = layer.textureAnimationId;
    let gl = model.viewer.gl;

    this.index = layerId;
    this.priorityPlane = priorityPlane;
    this.filterMode = filterMode;
    this.textureId = layer.textureId;
    this.coordId = layer.coordId;
    this.alpha = layer.alpha;

    let flags = layer.flags;

    this.unshaded = flags & 0x1;
    this.sphereEnvironmentMap = flags & 0x2;
    this.twoSided = flags & 0x10;
    this.unfogged = flags & 0x20;
    this.noDepthTest = flags & 0x40;
    this.noDepthSet = flags & 0x80;

    this.depthMaskValue = (filterMode === 0 || filterMode === 1) ? 1 : 0;

    this.blendSrc = 0;
    this.blendDst = 0;
    this.blended = (filterMode > 1) ? true : false;

    if (this.blended) {
      [this.blendSrc, this.blendDst] = layerFilterMode(filterMode, gl);
    }

    if (textureAnimationId !== -1) {
      let textureAnimation = model.textureAnimations[textureAnimationId];

      if (textureAnimation) {
        this.textureAnimation = textureAnimation;
      }
    }

    let variants = {
      alpha: [],
      slot: [],
      translation: [],
      rotation: [],
      scale: [],
      object: [],
    };

    let hasAlphaAnim = false;
    let hasSlotAnim = false;
    let hasTranslationAnim = false;
    let hasRotationAnim = false;
    let hasScaleAnim = false;

    for (let i = 0, l = model.sequences.length; i < l; i++) {
      let alpha = this.isAlphaVariant(i);
      let slot = this.isTextureIdVariant(i);
      let translation = this.isTranslationVariant(i);
      let rotation = this.isRotationVariant(i);
      let scale = this.isScaleVariant(i);

      variants.alpha[i] = alpha;
      variants.slot[i] = slot;
      variants.translation[i] = translation;
      variants.rotation[i] = rotation;
      variants.scale[i] = scale;
      variants.object[i] = alpha || slot || translation || rotation || scale;

      hasAlphaAnim = hasAlphaAnim || slot;
      hasSlotAnim = hasSlotAnim || slot;
      hasTranslationAnim = hasTranslationAnim || translation;
      hasRotationAnim = hasRotationAnim || rotation;
      hasScaleAnim = hasScaleAnim || scale;
    }

    this.variants = variants;
    this.hasAlphaAnim = hasAlphaAnim;
    this.hasSlotAnim = hasSlotAnim;
    this.hasTranslationAnim = hasTranslationAnim;
    this.hasRotationAnim = hasRotationAnim;
    this.hasScaleAnim = hasScaleAnim;
    this.hasObjectAnim = hasAlphaAnim || hasSlotAnim || hasTranslationAnim || hasRotationAnim || hasScaleAnim;
  }

  /**
   * @param {ShaderProgram} shader
   */
  bind(shader) {
    let gl = this.model.viewer.gl;

    // gl.uniform1f(shader.uniforms.u_unshaded, this.unshaded);
    gl.uniform1f(shader.uniforms.u_filterMode, this.filterMode);

    if (this.blended) {
      gl.enable(gl.BLEND);
      gl.blendFunc(this.blendSrc, this.blendDst);
    } else {
      gl.disable(gl.BLEND);
    }

    if (this.twoSided) {
      gl.disable(gl.CULL_FACE);
    } else {
      gl.enable(gl.CULL_FACE);
    }

    if (this.noDepthTest) {
      gl.disable(gl.DEPTH_TEST);
    } else {
      gl.enable(gl.DEPTH_TEST);
    }

    if (this.noDepthSet) {
      gl.depthMask(0);
    } else {
      gl.depthMask(this.depthMaskValue);
    }
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getAlpha(out, instance) {
    return this.getFloatValue(out, 'KMTA', instance, this.alpha);
  }

  /**
   * @param {Uint32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getTextureId(out, instance) {
    return this.getUintValue(out, 'KMTF', instance, this.textureId);
  }

  /**
   * @param {vec3} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getTranslation(out, instance) {
    if (this.textureAnimation) {
      return this.textureAnimation.getTranslation(out, instance);
    }

    vec3.copy(out, VEC3_ZERO);
    return -1;
  }

  /**
   * @param {quat} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getRotation(out, instance) {
    if (this.textureAnimation) {
      return this.textureAnimation.getRotation(out, instance);
    }

    quat.copy(out, QUAT_DEFAULT);
    return -1;
  }

  /**
   * @param {vec3} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getScale(out, instance) {
    if (this.textureAnimation) {
      return this.textureAnimation.getScale(out, instance);
    }

    vec3.copy(out, VEC3_ONE);
    return -1;
  }

  /**
   * @param {number} sequence
   * @return {boolean}
   */
  isAlphaVariant(sequence) {
    return this.isVariant('KMTA', sequence);
  }

  /**
   * @param {number} sequence
   * @return {boolean}
   */
  isTextureIdVariant(sequence) {
    return this.isVariant('KMTF', sequence);
  }

  /**
   * @param {number} sequence
   * @return {boolean}
   */
  isTranslationVariant(sequence) {
    return (this.textureAnimation && this.textureAnimation.isTranslationVariant(sequence)) || false;
  }

  /**
   * @param {number} sequence
   * @return {boolean}
   */
  isRotationVariant(sequence) {
    return (this.textureAnimation && this.textureAnimation.isRotationVariant(sequence)) || false;
  }

  /**
   * @param {number} sequence
   * @return {boolean}
   */
  isScaleVariant(sequence) {
    return (this.textureAnimation && this.textureAnimation.isScaleVariant(sequence)) || false;
  }
}
