import BinaryStream from '../../../common/binarystream';
import RandomItemSet from './randomitemset';

/**
 * A random item table.
 */
export default class RandomItemTable {
  id: number = 0;
  name: string = '';
  sets: RandomItemSet[] = [];

  load(stream: BinaryStream) {
    this.id = stream.readInt32();
    this.name = stream.readUntilNull();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let set = new RandomItemSet();

      set.load(stream);

      this.sets[i] = set;
    }
  }

  save(stream: BinaryStream) {
    stream.writeInt32(this.id);
    stream.write(`${this.name}\0`);
    stream.writeUint32(this.sets.length);

    for (let set of this.sets) {
      set.save(stream);
    }
  }

  getByteLength() {
    let size = 9 + this.name.length;

    for (let set of this.sets) {
      size += set.getByteLength();
    }

    return size;
  }
}
