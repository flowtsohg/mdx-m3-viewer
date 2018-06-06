
/**
 * An import.
 */
export default class Import {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.isCustom = 0;
    /** @member {string} */
    this.name = '';
  }

  /**
   * @param {BinaryStream} stream
   */
  load(stream) {
    this.isCustom = stream.readUint8();
    this.name = stream.readUntilNull();
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.writeUint8(this.isCustom);
    stream.write(`${this.name}\0`);
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 2 + this.name.length;
  }
}
