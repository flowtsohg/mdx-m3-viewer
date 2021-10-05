import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * An event.
 */
export default class Event {
  version = -1;
  name = new Reference();
  unknown0 = 0;
  unknown1 = 0;
  unknown2 = 0;
  matrix = new Float32Array(16);
  unknown3 = 0;
  unknown4 = 0;
  unknown5 = 0;
  unknown6 = 0;
  unknown7 = 0;
  unknown8 = 0;

  load(stream: BinaryStream, version: number, index: IndexEntry[]): void {
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
