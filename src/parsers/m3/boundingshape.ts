import BinaryStream from '../../common/binarystream';

/**
 * A bounding shape.
 */
export default class BoundingShape {
  shape: number = -1;
  bone: number = -1;
  unknown0: number = 0;
  matrix: Float32Array = new Float32Array(16);
  unknown1: number = 0;
  unknown2: number = 0;
  unknown3: number = 0;
  unknown4: number = 0;
  unknown5: number = 0;
  unknown6: number = 0;
  size: Float32Array = new Float32Array(3);

  load(stream: BinaryStream) {
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
