import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * An animation getter.
 */
export default class M3ParserStg {
  version: number;
  name: Reference;
  stcIndices: Reference;

  constructor(reader: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.name = new Reference(reader, index);
    this.stcIndices = new Reference(reader, index);
  }
}
