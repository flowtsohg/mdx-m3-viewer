/**
 * An MDX material.
 */
export default class Material {
  /**
   * @param {Model} model
   * @param {string} shader
   * @param {Array<Layer>} layers
   */
  constructor(model, shader, layers) {
    this.model = model;
    this.shader = shader;
    this.layers = layers;
  }
}
