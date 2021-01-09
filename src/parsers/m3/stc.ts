import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * An animation timeline.
 */
export default class Stc {
  version: number = -1;
  name: Reference = new Reference();
  runsConcurrent: number = 0;
  priority: number = 0;
  stsIndex: number = -1;
  stsIndexCopy: number = -1;
  animIds: Reference = new Reference();
  animRefs: Reference = new Reference();
  sd: Reference[] = [];

  constructor() {
    for (let i = 0; i < 13; i++) {
      this.sd[i] = new Reference();
    }
  }

  load(stream: BinaryStream, version: number, index: IndexEntry[]) {
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
