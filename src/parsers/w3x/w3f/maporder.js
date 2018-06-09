
/**
 * A map order.
 */
export default class MapOrder {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.u1 = 0;
    /** @member {string} */
    this.path = '';
  }

  /**
   * @param {BinaryStream} stream
   */
  load(stream) {
    this.u1 = stream.readInt8();
    this.path = stream.readUntilNull();
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.writeInt8(this.u1);
    stream.write(`${this.path}\0`);
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 2 + this.path.length;
  }
}
