/**
 * A player.
 */
export default class Player {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.id = 0;
    /** @member {number} */
    this.type = 0;
    /** @member {number} */
    this.race = 0;
    /** @member {number} */
    this.isFixedStartPosition = 0;
    /** @member {string} */
    this.name = '';
    /** @member {Float32Array} */
    this.startLocation = new Float32Array(2);
    /** @member {number} */
    this.allyLowPriorities = 0;
    /** @member {number} */
    this.allyHighPriorities = 0;
  }

  /**
   * @param {BinaryStream} stream
   */
  load(stream) {
    this.id = stream.readInt32();
    this.type = stream.readInt32();
    this.race = stream.readInt32();
    this.isFixedStartPosition = stream.readInt32();
    this.name = stream.readUntilNull();
    this.startLocation = stream.readFloat32Array(2);
    this.allyLowPriorities = stream.readUint32();
    this.allyHighPriorities = stream.readUint32();
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.writeInt32(this.id);
    stream.writeInt32(this.type);
    stream.writeInt32(this.race);
    stream.writeInt32(this.isFixedStartPosition);
    stream.write(`${this.name}\0`);
    stream.writeFloat32Array(this.startLocation);
    stream.writeUint32(this.allyLowPriorities);
    stream.writeUint32(this.allyHighPriorities);
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 33 + this.name.length;
  }
}
