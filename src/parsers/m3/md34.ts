import reverse from '../../common/stringreverse';
import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * The M3 header.
 */
export default class Md34 {
  version = -1;
  tag = '';
  offset = 0;
  entries = 0;
  model = new Reference();

  load(stream: BinaryStream, version: number, index: IndexEntry[]): void {
    this.version = version;
    this.tag = reverse(stream.readBinary(4));
    this.offset = stream.readUint32();
    this.entries = stream.readUint32();
    this.model.load(stream, index);
  }
}
