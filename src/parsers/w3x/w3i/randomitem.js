/**
 * A random item.
 */
export default class RandomItem {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.chance = 0;
    /** @member {string} */
    this.id = '\0\0\0\0';
  }

  /**
   * @param {BinaryStream} stream
   */
  load(stream) {
    this.chance = stream.readInt32();
    this.id = stream.read(4);
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.writeInt32(this.chance);
    stream.write(this.id);
  }
}
