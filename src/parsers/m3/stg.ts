import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * An animation getter.
 */
export default class Stg {
  version: number = -1;
  name: Reference = new Reference();
  stcIndices: Reference = new Reference();

  load(stream: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.name.load(stream, index);
    this.stcIndices.load(stream, index);
  }
}
