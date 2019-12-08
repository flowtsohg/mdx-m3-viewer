import ModelInstance from '../../modelinstance';
import GeometryModel from './model';

/**
 * A GEO model instance.
 */
export default class GeometryModelInstance extends ModelInstance {
  faceColor: Uint8Array;
  edgeColor: Uint8Array;

  constructor(model: GeometryModel) {
    super(model);

    this.faceColor = new Uint8Array(3);
    this.edgeColor = new Uint8Array(3);
  }

  load() {
    let model = <GeometryModel>this.model;

    // Initialize to the model's material colors.
    this.setFaceColor(model.faceColor);
    this.setEdgeColor(model.edgeColor);
  }

  setFaceColor(color: Uint8Array) {
    this.faceColor.set(color);

    return this;
  }

  setEdgeColor(color: Uint8Array) {
    this.edgeColor.set(color);

    return this;
  }

  isBatched() {
    return true;
  }
}
