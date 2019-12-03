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
    /** @member {Model} */
    this.model = model;
    /** @member {string} */
    this.shader = shader;
    /** @member {Array<Layer>} */
    this.layers = layers;
  }
}
