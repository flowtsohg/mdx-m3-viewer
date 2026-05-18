import MdxModel from './model';
import Layer from './layer';

/**
 * An MDX material.
 */
export default class Material {
  model: MdxModel;
  shader: string;
  layers: Layer[];
  /**
   * Whether this material renders through the HD pipeline.
   *
   * Pre-1100 this is signalled by the shader string; since 1100 the shader
   * string is gone and it comes from the layer's shader type instead.
   */
  isHd: boolean;

  constructor(model: MdxModel, shader: string, layers: Layer[], isHd: boolean) {
    this.model = model;
    this.shader = shader;
    this.layers = layers;
    this.isHd = isHd;
  }
}
