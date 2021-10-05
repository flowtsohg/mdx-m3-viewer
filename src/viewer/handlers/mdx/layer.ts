import MdlxLayer, { FilterMode, Flags } from '../../../parsers/mdlx/layer';
import MdxModel from './model';
import AnimatedObject from './animatedobject';
import TextureAnimation from './textureanimation';
import { layerFilterMode } from './filtermode';
import Shader from '../../gl/shader';

/**
 * An MDX layer.
 */
export default class Layer extends AnimatedObject {
  index: number;
  priorityPlane: number;
  filterMode: FilterMode;
  textureId = 0;
  coordId: number;
  alpha: number;
  unshaded: number;
  sphereEnvironmentMap: number;
  twoSided: number;
  unfogged: number;
  noDepthTest: number;
  noDepthSet: number;
  depthMaskValue: boolean;
  blendSrc = 0;
  blendDst = 0;
  blended = false;
  textureAnimation: TextureAnimation | null = null;

  constructor(model: MdxModel, layer: MdlxLayer, layerId: number, priorityPlane: number) {
    super(model, layer);

    let filterMode = layer.filterMode;
    const textureAnimationId = layer.textureAnimationId;
    const gl = model.viewer.gl;

    this.index = layerId;
    this.priorityPlane = priorityPlane;

    if (filterMode > FilterMode.Modulate2x) {
      filterMode = FilterMode.Blend;
    }

    this.filterMode = filterMode;

    if (layer.textureId !== -1) {
      this.textureId = layer.textureId;
    }

    this.coordId = layer.coordId;
    this.alpha = layer.alpha;

    const flags = layer.flags;

    this.unshaded = flags & Flags.Unshaded;
    this.sphereEnvironmentMap = flags & Flags.SphereEnvMap;
    this.twoSided = flags & Flags.TwoSided;
    this.unfogged = flags & Flags.Unfogged;
    this.noDepthTest = flags & Flags.NoDepthTest;
    this.noDepthSet = flags & Flags.NoDepthSet;

    this.depthMaskValue = (filterMode === FilterMode.None || filterMode === FilterMode.Transparent);

    if (filterMode > FilterMode.Transparent) {
      this.blended = true;
      [this.blendSrc, this.blendDst] = layerFilterMode(filterMode, gl);
    }

    if (textureAnimationId !== -1) {
      const textureAnimation = model.textureAnimations[textureAnimationId];

      if (textureAnimation) {
        this.textureAnimation = textureAnimation;
      }
    }

    this.addVariants('KMTA', 'alpha');
    this.addVariants('KMTF', 'textureId');
  }

  bind(shader: Shader): void {
    const gl = this.model.viewer.gl;

    // gl.uniform1f(shader.uniforms.u_unshaded, this.unshaded);
    gl.uniform1f(shader.uniforms['u_filterMode'], this.filterMode);

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

  getAlpha(out: Float32Array, sequence: number, frame: number, counter: number): number {
    return this.getScalarValue(out, 'KMTA', sequence, frame, counter, this.alpha);
  }

  getTextureId(out: Uint32Array, sequence: number, frame: number, counter: number): number {
    return this.getScalarValue(out, 'KMTF', sequence, frame, counter, this.textureId);
  }
}
