import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * An animation validator.
 */
export default class M3ParserSts {
  version: number;
  animIds: Reference;

  constructor(reader: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.animIds = new Reference(reader, index);

    reader.skip(16); // ?
  }
}
