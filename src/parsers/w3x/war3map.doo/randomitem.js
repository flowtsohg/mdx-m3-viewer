/**
 * A random item.
 */
export default class RandomItem {
  /**
   *
   */
  constructor() {
    /** @member {string} */
    this.id = '\0\0\0\0';
    /** @member {number} */
    this.chance = 0;
  }

  /**
   * @param {BinaryStream} stream
   */
  load(stream) {
    this.id = stream.read(4);
    this.chance = stream.readInt32();
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.write(this.id);
    stream.writeInt32(this.chance);
  }
}
