import BinaryStream from '../../../common/binarystream';
import DroppedItem from './droppeditem';

/**
 * A dropped item set.
 */
export default class DroppedItemSet {
  items: DroppedItem[] = [];

  load(stream: BinaryStream) {
    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let item = new DroppedItem();

      item.load(stream);

      this.items[i] = item;
    }
  }

  save(stream: BinaryStream) {
    stream.writeInt32(this.items.length);

    for (let item of this.items) {
      item.save(stream);
    }
  }

  getByteLength() {
    return 4 + this.items.length * 8;
  }
}
