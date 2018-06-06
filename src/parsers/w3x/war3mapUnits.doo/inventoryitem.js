/**
 * An inventory item.
 */
export default class InventoryItem {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.slot = 0;
    /** @member {string} */
    this.id = '\0\0\0\0';
  }

  /**
   * @param {BinaryStream} stream
   */
  load(stream) {
    this.slot = stream.readInt32();
    this.id = stream.read(4);
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.writeInt32(this.slot);
    stream.write(this.id);
  }
}
