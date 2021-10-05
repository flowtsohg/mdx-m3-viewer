import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * An animation getter.
 */
export default class Stg {
  version = -1;
  name = new Reference();
  stcIndices = new Reference();

  load(stream: BinaryStream, version: number, index: IndexEntry[]): void {
    this.version = version;
    this.name.load(stream, index);
    this.stcIndices.load(stream, index);
  }
}
