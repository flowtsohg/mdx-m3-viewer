import BinaryStream from '../../common/binarystream';

/**
 * A bounding sphere.
 */
export default class BoundingSphere {
  min: Float32Array = new Float32Array(3);
  max: Float32Array = new Float32Array(3);
  radius: number = 0;

  load(stream: BinaryStream) {
    stream.readFloat32Array(this.min);
    stream.readFloat32Array(this.max);
    this.radius = stream.readFloat32();
  }
}
