import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * An event.
 */
export default class Event {
  version: number = -1;
  name: Reference = new Reference();
  unknown0: number = 0;
  unknown1: number = 0;
  unknown2: number = 0;
  matrix: Float32Array = new Float32Array(16);
  unknown3: number = 0;
  unknown4: number = 0;
  unknown5: number = 0;
  unknown6: number = 0;
  unknown7: number = 0;
  unknown8: number = 0;

  load(stream: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.name.load(stream, index);
    this.unknown0 = stream.readInt32();
    this.unknown1 = stream.readInt16();
    this.unknown2 = stream.readUint16();
    stream.readFloat32Array(this.matrix);
    this.unknown3 = stream.readInt32();
    this.unknown4 = stream.readInt32();
    this.unknown5 = stream.readInt32();

    if (version > 0) {
      this.unknown6 = stream.readInt32();
      this.unknown7 = stream.readInt32();
    }

    if (version > 1) {
      this.unknown8 = stream.readInt32();
    }
  }
}
