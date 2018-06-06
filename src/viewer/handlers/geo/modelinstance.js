import TexturedModelInstance from '../../texturedmodelinstance';

/**
 * A GEO model instance.
 */
export default class GeometryModelInstance extends TexturedModelInstance {
  /**
   * @param {GeometryModel} model
   */
  constructor(model) {
    super(model);

    this.vertexColor = new Uint8Array(4);
    this.edgeColor = new Uint8Array(4);
  }

  /**
   *
   */
  load() {
    // Initialize to the model's material colors.
    this.setVertexColor(this.model.vertexColor);
    this.setEdgeColor(this.model.edgeColor);
  }

  /**
   * @param {Uint8Array} color
   * @return {this}
   */
  setVertexColor(color) {
    this.vertexColor.set(color);

    return this;
  }

  /**
   * @param {Uint8Array} color
   * @return {this}
   */
  setEdgeColor(color) {
    this.edgeColor.set(color);

    return this;
  }
}
