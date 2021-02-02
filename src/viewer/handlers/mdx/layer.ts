import MdlxLayer from '../../../parsers/mdlx/layer';
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
  filterMode: number;
  textureId: number = 0;
  coordId: number;
  alpha: number;
  unshaded: number;
  sphereEnvironmentMap: number;
  twoSided: number;
  unfogged: number;
  noDepthTest: number;
  noDepthSet: number;
  depthMaskValue: boolean;
  blendSrc: number = 0;
  blendDst: number = 0;
  blended: boolean = false;
  textureAnimation: TextureAnimation | null = null;

  constructor(model: MdxModel, layer: MdlxLayer, layerId: number, priorityPlane: number) {
    super(model, layer);

    let filterMode = layer.filterMode;
    let textureAnimationId = layer.textureAnimationId;
    let gl = model.viewer.gl;

    this.index = layerId;
    this.priorityPlane = priorityPlane;
    this.filterMode = filterMode;

    if (layer.textureId !== -1) {
      this.textureId = layer.textureId;
    }

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

    if (filterMode > 1) {
      this.blended = true;
      [this.blendSrc, this.blendDst] = layerFilterMode(filterMode, gl);
    }

    if (textureAnimationId !== -1) {
      let textureAnimation = model.textureAnimations[textureAnimationId];

      if (textureAnimation) {
        this.textureAnimation = textureAnimation;
      }
    }

    this.addVariants('KMTA', 'alpha');
    this.addVariants('KMTF', 'textureId');
  }

  bind(shader: Shader) {
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

  getAlpha(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KMTA', sequence, frame, counter, this.alpha);
  }

  getTextureId(out: Uint32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KMTF', sequence, frame, counter, this.textureId);
  }
}
