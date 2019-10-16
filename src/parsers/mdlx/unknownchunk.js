/**
 * An unknown chunk.
 */
export default class UnknownChunk {
  /**
   * @param {BinaryStream} stream
   * @param {number} size
   * @param {string} tag
   */
  constructor(stream, size, tag) {
    /** @member {string} */
    this.tag = tag;
    /** @member {Uint8Array} */
    this.chunk = stream.readUint8Array(new Uint8Array(size));
  }

  /**
   * @param {BinaryStream} stream
   */
  writeMdx(stream) {
    stream.write(this.tag);
    stream.writeUint32(this.chunk.byteLength);
    stream.writeUint8Array(this.chunk);
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 8 + this.chunk.byteLength;
  }
}
