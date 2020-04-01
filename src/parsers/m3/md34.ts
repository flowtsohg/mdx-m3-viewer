import reverse from '../../common/stringreverse';
import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * The M3 header.
 */
export default class M3ParserMd34 {
  version: number;
  tag: string;
  offset: number;
  entries: number;
  model: Reference;

  constructor(reader: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.tag = reverse(reader.read(4));
    this.offset = reader.readUint32();
    this.entries = reader.readUint32();
    this.model = new Reference(reader, index);
  }
}
