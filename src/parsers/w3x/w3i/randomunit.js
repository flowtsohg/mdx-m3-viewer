/**
 * A random unit.
 */
export default class RandomUnit {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.chance = 0;
    /** @member {Array<string>} */
    this.ids = [];
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} positions
   */
  load(stream, positions) {
    this.chance = stream.readInt32();

    for (let i = 0; i < positions; i++) {
      this.ids[i] = stream.read(4, true);
    }
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.writeInt32(this.chance);

    for (let id of this.ids) {
      stream.write(id);
    }
  }
}
