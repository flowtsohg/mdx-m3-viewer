import RandomItem from './randomitem';

/**
 * A random item set.
 */
export default class RandomItemSet {
  /**
   *
   */
  constructor() {
    /** @member {Array<RandomItem>} */
    this.items = [];
  }

  /**
   * @param {BinaryStream} stream
   */
  load(stream) {
    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let item = new RandomItem();

      item.load(stream);

      this.items.push(item);
    }
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.writeUint32(this.items.length);

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
