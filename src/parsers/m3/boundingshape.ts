import BinaryStream from '../../common/binarystream';

/**
 * A bounding shape.
 */
export default class M3ParserBoundingShape {
  shape: number;
  bone: number;
  unknown0: number;
  matrix: Float32Array;
  unknown1: number;
  unknown2: number;
  unknown3: number;
  unknown4: number;
  unknown5: number;
  unknown6: number;
  size: Float32Array;

  constructor(reader: BinaryStream) {
    this.shape = reader.readUint32();
    this.bone = reader.readInt16();
    this.unknown0 = reader.readUint16();
    this.matrix = reader.readFloat32Array(16);
    this.unknown1 = reader.readUint32();
    this.unknown2 = reader.readUint32();
    this.unknown3 = reader.readUint32();
    this.unknown4 = reader.readUint32();
    this.unknown5 = reader.readUint32();
    this.unknown6 = reader.readUint32();
    this.size = reader.readFloat32Array(3);
  }
}
