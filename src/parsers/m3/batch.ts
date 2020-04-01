import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';

/**
 * A batch.
 */
export default class M3ParserBatch {
  version: number;
  unknown0: number;
  regionIndex: number;
  unknown1: number;
  materialReferenceIndex: number;
  unknown2: number;

  constructor(reader: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.unknown0 = reader.readUint32();
    this.regionIndex = reader.readUint16();
    this.unknown1 = reader.readUint32();
    this.materialReferenceIndex = reader.readUint16();
    this.unknown2 = reader.readUint16();
  }
}
