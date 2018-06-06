/**
 * A minimap icon.
 */
export default class MinimapIcon {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.type = 0;
    /** @member {Int32Array} */
    this.location = new Int32Array(2);
    /** @member {Uint8Array} */
    this.color = new Uint8Array(4); // BGRA
  }

  /**
   * @param {BinaryStream} stream
   */
  load(stream) {
    this.type = stream.readInt32();
    this.location = stream.readInt32Array(2);
    this.color = stream.readUint8Array(4);
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.writeInt32(this.type);
    stream.writeInt32Array(this.location);
    stream.writeUint8Array(this.color);
  }
}
