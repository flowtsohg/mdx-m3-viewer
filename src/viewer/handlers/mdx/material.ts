import MdxModel from './model';
import Layer from './layer';

/**
 * An MDX material.
 */
export default class Material {
  model: MdxModel;
  shader: string;
  layers: Layer[];

  constructor(model: MdxModel, shader: string, layers: Layer[]) {
    this.model = model;
    this.shader = shader;
    this.layers = layers;
  }
}
