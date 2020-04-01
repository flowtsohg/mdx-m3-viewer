import BinaryStream from '../../common/binarystream';

/**
 * A bounding sphere.
 */
export default class M3ParserBoundingSphere {
  min: Float32Array;
  max: Float32Array;
  radius: number;

  constructor(reader: BinaryStream) {
    this.min = reader.readFloat32Array(3);
    this.max = reader.readFloat32Array(3);
    this.radius = reader.readFloat32();
  }
}
