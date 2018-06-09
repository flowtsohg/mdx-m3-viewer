/**
 * An upgrade availability change.
 */
export default class UpgradeAvailabilityChange {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.playerFlags = 0;
    /** @member {string} */
    this.id = '\0\0\0\0';
    /** @member {number} */
    this.levelAffected = 0;
    /** @member {number} */
    this.availability = 0;
  }

  /**
   * @param {BinaryStream} stream
   */
  load(stream) {
    this.playerFlags = stream.readUint32();
    this.id = stream.read(4);
    this.levelAffected = stream.readInt32();
    this.availability = stream.readInt32();
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.writeUint32(this.playerFlags);
    stream.write(this.id);
    stream.writeInt32(this.levelAffected);
    stream.writeInt32(this.availability);
  }
}
