import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * An animation timeline.
 */
export default class Stc {
  version = -1;
  name = new Reference();
  runsConcurrent = 0;
  priority = 0;
  stsIndex = -1;
  stsIndexCopy = -1;
  animIds = new Reference();
  animRefs = new Reference();
  sd: Reference[] = [];

  constructor() {
    for (let i = 0; i < 13; i++) {
      this.sd[i] = new Reference();
    }
  }

  load(stream: BinaryStream, version: number, index: IndexEntry[]): void {
    this.version = version;
    this.name.load(stream, index);
    this.runsConcurrent = stream.readUint16();
    this.priority = stream.readUint16();
    this.stsIndex = stream.readUint16();
    this.stsIndexCopy = stream.readUint16(); // ?
    this.animIds.load(stream, index);
    this.animRefs.load(stream, index);

    stream.skip(4); // ?

    for (let i = 0; i < 13; i++) {
      this.sd[i].load(stream, index);
    }
  }
}
