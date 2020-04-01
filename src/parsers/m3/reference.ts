import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';

/**
 * A reference.
 */
export default class M3ParserReference {
  index: IndexEntry[];
  entries: number;
  id: number;
  flags: number;

  constructor(reader: BinaryStream, index: IndexEntry[]) {
    this.index = index;
    this.entries = reader.readUint32();
    this.id = reader.readUint32();
    this.flags = reader.readUint32();
  }

  /**
   * Get the entries this index entry references.
   */
  getAll() {
    let id = this.id;

    // For empty references (e.g. Layer.imagePath)
    if (id === 0 || this.entries === 0) {
      return [];
    }

    return this.index[id].entries;
  }

  /**
   * Get the first entry this index entry references.
   */
  get() {
    let id = this.id;

    if (id !== 0 && this.entries !== 0) {
      let entries = this.index[id].entries;

      if (entries) {
        return entries[0];
      }
    }
  }
}
