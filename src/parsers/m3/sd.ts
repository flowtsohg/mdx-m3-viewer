import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * Sequence data.
 */
export default class Sd {
  version: number = -1;
  keys: Reference = new Reference();
  flags: number = 0;
  biggestKey: number = -1;
  values: Reference = new Reference();

  load(stream: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.keys.load(stream, index);
    this.flags = stream.readUint32();
    this.biggestKey = stream.readUint32();
    this.values.load(stream, index);
  }
}
