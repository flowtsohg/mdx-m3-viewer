import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * Sequence data.
 */
export default class Sd {
  version = -1;
  keys = new Reference();
  flags = 0;
  biggestKey = -1;
  values = new Reference();

  load(stream: BinaryStream, version: number, index: IndexEntry[]): void {
    this.version = version;
    this.keys.load(stream, index);
    this.flags = stream.readUint32();
    this.biggestKey = stream.readUint32();
    this.values.load(stream, index);
  }
}
