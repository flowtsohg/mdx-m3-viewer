/**
 * A tech availablity change.
 */
export default class TechAvailabilityChange {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.playerFlags = 0;
    /** @member {string} */
    this.id = '\0\0\0\0';
  }

  /**
   * @param {BinaryStream} stream
   */
  load(stream) {
    this.playerFlags = stream.readUint32();
    this.id = stream.read(4);
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.writeUint32(this.playerFlags);
    stream.write(this.id);
  }
}
