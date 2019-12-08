import MdlxLayer from '../../../parsers/mdlx/layer';
import MdxModel from './model';
import AnimatedObject from './animatedobject';
import TextureAnimation from './textureanimation';
import { layerFilterMode } from './filtermode';
import ShaderProgram from '../../gl/program';
import MdxComplexInstance from './complexinstance';

/**
 * An MDX layer.
 */
export default class Layer extends AnimatedObject {
  index: number;
  priorityPlane: number;
  filterMode: number;
  textureId: number;
  coordId: number;
  alpha: number;
  unshaded: number;
  sphereEnvironmentMap: number;
  twoSided: number;
  unfogged: number;
  noDepthTest: number;
  noDepthSet: number;
  depthMaskValue: boolean;
  blendSrc: number;
  blendDst: number;
  blended: boolean;
  textureAnimation: TextureAnimation | null = null;
  variants: CHANGE_ME;
  hasAlphaAnim: boolean;
  hasSlotAnim: boolean;
  hasTranslationAnim: boolean;
  hasRotationAnim: boolean;
  hasScaleAnim: boolean;
  hasObjectAnim: boolean;

  constructor(model: MdxModel, layer: MdlxLayer, layerId: number, priorityPlane: number) {
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

    this.depthMaskValue = (filterMode === 0 || filterMode === 1);

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

  bind(shader: ShaderProgram) {
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
      gl.depthMask(false);
    } else {
      gl.depthMask(this.depthMaskValue);
    }
  }

  getAlpha(out: Float32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KMTA', instance, this.alpha);
  }

  getTextureId(out: Uint32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KMTF', instance, this.textureId);
  }

  getTranslation(out: Float32Array, instance: MdxComplexInstance) {
    if (this.textureAnimation) {
      return this.textureAnimation.getTranslation(out, instance);
    }

    out[0] = 0;
    out[1] = 0;
    out[2] = 0;

    return -1;
  }

  getRotation(out: Float32Array, instance: MdxComplexInstance) {
    if (this.textureAnimation) {
      return this.textureAnimation.getRotation(out, instance);
    }

    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;

    return -1;
  }

  getScale(out: Float32Array, instance: MdxComplexInstance) {
    if (this.textureAnimation) {
      return this.textureAnimation.getScale(out, instance);
    }

    out[0] = 1;
    out[1] = 1;
    out[2] = 1;

    return -1;
  }

  isAlphaVariant(sequence: number) {
    return this.isVariant('KMTA', sequence);
  }

  isTextureIdVariant(sequence: number) {
    return this.isVariant('KMTF', sequence);
  }

  isTranslationVariant(sequence: number) {
    return (this.textureAnimation && this.textureAnimation.isTranslationVariant(sequence)) || false;
  }

  isRotationVariant(sequence: number) {
    return (this.textureAnimation && this.textureAnimation.isRotationVariant(sequence)) || false;
  }

  isScaleVariant(sequence: number) {
    return (this.textureAnimation && this.textureAnimation.isScaleVariant(sequence)) || false;
  }
}
