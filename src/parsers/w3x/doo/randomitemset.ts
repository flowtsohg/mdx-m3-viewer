import RandomItem from './randomitem';
import BinaryStream from '../../../common/binarystream';

/**
 * A random item set.
 */
export default class RandomItemSet {
  items: RandomItem[] = [];

  load(stream: BinaryStream) {
    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let item = new RandomItem();

      item.load(stream);

      this.items.push(item);
    }
  }

  save(stream: BinaryStream) {
    stream.writeUint32(this.items.length);

    for (let item of this.items) {
      item.save(stream);
    }
  }

  getByteLength() {
    return 4 + this.items.length * 8;
  }
}
