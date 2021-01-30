import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Md34 from './md34';
import ModelHeader from './modelheader';

/**
 * A model.
 */
export default class Model {
  index: IndexEntry[] = [];
  model: ModelHeader | null = null;

  load(src: ArrayBuffer | Uint8Array) {
    let stream = new BinaryStream(src);
    let header = new Md34();

    header.load(stream, 11, this.index);

    if (header.tag !== 'MD34') {
      throw new Error('WrongMagicNumber');
    }

    stream.seek(header.offset);

    // Read the index entries
    for (let i = 0, l = header.entries; i < l; i++) {
      this.index[i] = new IndexEntry(stream, this.index);
    }

    let modelEntries = this.index[header.model.id].entries;

    if (modelEntries) {
      this.model = modelEntries[0];
    }
  }
}
