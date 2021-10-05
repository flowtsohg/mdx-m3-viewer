import BinaryStream from '../../common/binarystream';

/**
 * A bounding shape.
 */
export default class BoundingShape {
  shape = -1;
  bone = -1;
  unknown0 = 0;
  matrix = new Float32Array(16);
  unknown1 = 0;
  unknown2 = 0;
  unknown3 = 0;
  unknown4 = 0;
  unknown5 = 0;
  unknown6 = 0;
  size = new Float32Array(3);

  load(stream: BinaryStream): void {
    this.shape = stream.readUint32();
    this.bone = stream.readInt16();
    this.unknown0 = stream.readUint16();
    stream.readFloat32Array(this.matrix);
    this.unknown1 = stream.readUint32();
    this.unknown2 = stream.readUint32();
    this.unknown3 = stream.readUint32();
    this.unknown4 = stream.readUint32();
    this.unknown5 = stream.readUint32();
    this.unknown6 = stream.readUint32();
    stream.readFloat32Array(this.size);
  }
}
