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
    /** @member {Uint8Array} */
    this.chunk = stream.readUint8Array(new Uint8Array(size));
    /** @member {string} */
    this.tag = tag;
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return this.chunk.byteLength;
  }
}
