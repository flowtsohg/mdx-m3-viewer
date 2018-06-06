import DroppedItem from './droppeditem';

/**
 * A dropped item set.
 */
export default class DroppedItemSet {
  /**
   *
   */
  constructor() {
    /** @member {Array<DroppedItem>} */
    this.items = [];
  }

  /**
   * @param {BinaryStream} stream
   */
  load(stream) {
    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let item = new DroppedItem();

      item.load(stream);

      this.items[i] = item;
    }
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.writeInt32(this.items.length);

    for (let item of this.items) {
      item.save(stream);
    }
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 4 + this.items.length * 8;
  }
}
