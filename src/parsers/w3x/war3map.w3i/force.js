/**
 * A force.
 */
export default class Force {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.flags = 0;
    /** @member {number} */
    this.playerMasks = 0;
    /** @member {string} */
    this.name = '';
  }

  /**
   * @param {BinaryStream} stream
   */
  load(stream) {
    this.flags = stream.readUint32();
    this.playerMasks = stream.readUint32();
    this.name = stream.readUntilNull();
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.writeUint32(this.flags);
    stream.writeUint32(this.playerMasks);
    stream.write(`${this.name}\0`);
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 9 + this.name.length;
  }
}
