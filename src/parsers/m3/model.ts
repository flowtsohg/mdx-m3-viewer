import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';
import Md34 from './md34';
import ModelHeader from './modelheader';

/**
 * A model.
 */
export default class Model {
  entries: IndexEntry[];
  model: ModelHeader | null;

  constructor(src: ArrayBuffer) {
    this.entries = [];
    this.model = null;

    let reader = new BinaryStream(src);
    let header = new Md34(reader, 11, this.entries);

    if (header.tag === 'MD34') {
      reader.seek(header.offset);

      // Read the index entries
      for (let i = 0, l = header.entries; i < l; i++) {
        this.entries[i] = new IndexEntry(reader, this.entries);
      }

      let modelEntries = this.entries[header.model.id].entries;

      if (modelEntries) {
        this.model = modelEntries[0];
      }
    } else {
      throw new Error('WrongMagicNumber');
    }
  }
}
