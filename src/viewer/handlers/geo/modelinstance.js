import ModelInstance from '../../modelinstance';

/**
 * A GEO model instance.
 */
export default class GeometryModelInstance extends ModelInstance {
  /**
   * @param {GeometryModel} model
   */
  constructor(model) {
    super(model);

    this.faceColor = new Uint8Array(3);
    this.edgeColor = new Uint8Array(3);
  }

  /**
   *
   */
  load() {
    // Initialize to the model's material colors.
    this.setFaceColor(this.model.faceColor);
    this.setEdgeColor(this.model.edgeColor);
  }

  /**
   * @param {Uint8Array} color
   * @return {this}
   */
  setFaceColor(color) {
    this.faceColor.set(color);

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

  /**
   * @override
   * @return {boolean}
   */
  isBatched() {
    return true;
  }
}
