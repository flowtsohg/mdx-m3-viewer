import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * An event.
 */
export default class M3ParserEvent {
  version: number;
  name: Reference;
  unknown0: number;
  unknown1: number;
  unknown2: number;
  matrix: Float32Array;
  unknown3: number;
  unknown4: number;
  unknown5: number;
  unknown6: number = 0;
  unknown7: number = 0;
  unknown8: number = 0;

  constructor(reader: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.name = new Reference(reader, index);
    this.unknown0 = reader.readInt32();
    this.unknown1 = reader.readInt16();
    this.unknown2 = reader.readUint16();
    this.matrix = reader.readFloat32Array(16);
    this.unknown3 = reader.readInt32();
    this.unknown4 = reader.readInt32();
    this.unknown5 = reader.readInt32();

    if (version > 0) {
      this.unknown6 = reader.readInt32();
      this.unknown7 = reader.readInt32();
    }

    if (version > 1) {
      this.unknown8 = reader.readInt32();
    }
  }
}
