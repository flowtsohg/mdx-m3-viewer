import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';

/**
 * A reference.
 */
export default class Reference {
  index: IndexEntry[] | null = null;
  entries: number = 0;
  id: number = 0;
  flags: number = 0;

  load(stream: BinaryStream, index: IndexEntry[]) {
    this.index = index;
    this.entries = stream.readUint32();
    this.id = stream.readUint32();
    this.flags = stream.readUint32();
  }

  /**
   * Get the entries this index entry references.
   */
  get() {
    if (this.index && this.id !== 0 && this.entries !== 0) {
      return this.index[this.id].entries;
    }
  }

  /**
   * Get the first entry this index entry references.
   */
  first() {
    let entries = this.get();

    if (entries) {
      return entries[0];
    }
  }
}
