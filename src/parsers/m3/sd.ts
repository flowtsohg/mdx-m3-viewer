import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * Sequence data.
 */
export default class M3ParserSd {
  version: number;
  keys: Reference;
  flags: number;
  biggestKey: number;
  values: Reference;

  constructor(reader: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.keys = new Reference(reader, index);
    this.flags = reader.readUint32();
    this.biggestKey = reader.readUint32();
    this.values = new Reference(reader, index);
  }
}
