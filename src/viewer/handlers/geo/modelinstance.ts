import Scene from '../../scene';
import TextureMapper from '../../texturemapper';
import BatchedInstance from '../../batchedinstance';
import GeometryModel from './model';
import GeoRenderBatch from './renderbatch';

/**
 * A GEO model instance.
 */
export default class GeometryModelInstance extends BatchedInstance {
  faceColor: Uint8Array = new Uint8Array(3);
  edgeColor: Uint8Array = new Uint8Array(3);

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

  getBatch(textureMapper: TextureMapper) {
    return new GeoRenderBatch(<Scene>this.scene, this.model, textureMapper);
  }
}
