import BinaryStream from '../../common/binarystream';

/**
 * A bounding sphere.
 */
export default class BoundingSphere {
  min = new Float32Array(3);
  max = new Float32Array(3);
  radius = 0;

  load(stream: BinaryStream): void {
    stream.readFloat32Array(this.min);
    stream.readFloat32Array(this.max);
    this.radius = stream.readFloat32();
  }
}
