/**
 * A bit stream.
 */
export default class BitStream {
  /**
   * @constructor
   * @param {ArrayBuffer|ArrayBufferView} buffer
   * @param {number=} byteOffset
   * @param {number=} byteLength
   */
  constructor(buffer, byteOffset, byteLength) {
    // If given a view, use its properties.
    if (ArrayBuffer.isView(buffer)) {
      buffer = buffer.buffer;
      byteOffset = buffer.byteOffset;
      byteLength = buffer.byteLength;
    }

    if (!(buffer instanceof ArrayBuffer)) {
      throw new TypeError(`BitStream: expected ArrayBuffer or ArrayBufferView, got ${buffer}`);
    }

    /** @member {ArrayBuffer} */
    this.buffer = buffer;
    /** @member {Uint8Array} */
    this.uint8array = new Uint8Array(buffer, byteOffset, byteLength);
    /** @member {number} */
    this.index = 0;
    /** @member {number} */
    this.byteLength = buffer.byteLength;
    /** @member {number} */
    this.bitBuffer = 0;
    /** @member {number} */
    this.bits = 0;
  }

  /**
   * Peek a number of bits.
   *
   * @param {number} bits
   * @return {number}
   */
  peekBits(bits) {
    this.loadBits(bits);

    return this.bitBuffer & ((1 << bits) - 1);
  }

  /**
   * Read a number of bits.
   *
   * @param {number} bits
   * @return {number}
   */
  readBits(bits) {
    let data = this.peekBits(bits);

    this.bitBuffer >>>= bits;
    this.bits -= bits;

    return data;
  }

  /**
   * Skip a number of bits.
   *
   * @param {number} bits
   */
  skipBits(bits) {
    this.loadBits(bits);

    this.bitBuffer >>>= bits;
    this.bits -= bits;
  }

  /**
   * Load more bits into the buffer.
   *
   * @param {number} bits
   */
  loadBits(bits) {
    while (this.bits < bits) {
      this.bitBuffer += this.uint8array[this.index] << this.bits;
      this.bits += 8;
      this.index += 1;
    }
  }
}
