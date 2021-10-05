import { FilterMode as LayerFilterMode } from '../../../parsers/mdlx/layer';
import { FilterMode as Particle2FilterMode } from '../../../parsers/mdlx/particleemitter2';

export function layerFilterMode(filterMode: LayerFilterMode, gl: WebGLRenderingContext): number[] {
  if (filterMode === LayerFilterMode.Blend) {
    return [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
  } else if (filterMode === LayerFilterMode.Additive) {
    return [gl.SRC_ALPHA, gl.ONE];
  } else if (filterMode === LayerFilterMode.AddAlpha) {
    return [gl.SRC_ALPHA, gl.ONE];
  } else if (filterMode === LayerFilterMode.Modulate) {
    return [gl.ZERO, gl.SRC_COLOR];
  } else if (filterMode === LayerFilterMode.Modulate2x) {
    return [gl.DST_COLOR, gl.SRC_COLOR];
  } else {
    return [0, 0];
  }
}

export function emitterFilterMode(filterMode: Particle2FilterMode, gl: WebGLRenderingContext): number[] {
  if (filterMode === Particle2FilterMode.Blend) {
    return [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
  } else if (filterMode === Particle2FilterMode.Additive) {
    return [gl.SRC_ALPHA, gl.ONE];
  } else if (filterMode === Particle2FilterMode.Modulate) {
    return [gl.ZERO, gl.SRC_COLOR];
  } else if (filterMode === Particle2FilterMode.Modulate2x) {
    return [gl.DST_COLOR, gl.SRC_COLOR];
  } else if (filterMode === Particle2FilterMode.AlphaKey) {
    return [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
  } else {
    return [0, 0];
  }
}
