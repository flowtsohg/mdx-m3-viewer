import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * An attachment point.
 */
export default class M3ParserAttachmentPoint {
  version: number;
  unknown: number;
  name: Reference;
  bone: number;

  constructor(reader: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.unknown = reader.readInt32();
    this.name = new Reference(reader, index);
    this.bone = reader.readUint32();
  }
}
