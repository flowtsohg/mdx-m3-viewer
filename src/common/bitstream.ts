import { bytesOf } from './bytesof';

/**
 * A bit stream.
 */
export default class BitStream {
  buffer: ArrayBuffer;
  uint8array: Uint8Array;
  index = 0;
  byteLength: number;
  bitBuffer = 0;
  bits = 0;

  constructor(buffer: ArrayBuffer | Uint8Array, byteOffset?: number, byteLength?: number) {
    const bytes = bytesOf(buffer);

    // For browsers not supporting the spec.
    // Once upon a time I reported this issue on the Firefox tracker.
    // Seems like Safari needs an issue report too.
    byteOffset = byteOffset || 0;
    byteLength = byteLength || bytes.length;

    this.buffer = buffer;
    this.uint8array = bytes.subarray(byteOffset, byteOffset + byteLength);
    this.byteLength = buffer.byteLength;
  }

  /**
   * Peek a number of bits.
   */
  peekBits(bits: number): number {
    this.loadBits(bits);

    return this.bitBuffer & ((1 << bits) - 1);
  }

  /**
   * Read a number of bits.
   */
  readBits(bits: number): number {
    const data = this.peekBits(bits);

    this.bitBuffer >>>= bits;
    this.bits -= bits;

    return data;
  }

  /**
   * Skip a number of bits.
   */
  skipBits(bits: number): void {
    this.loadBits(bits);

    this.bitBuffer >>>= bits;
    this.bits -= bits;
  }

  /**
   * Load more bits into the buffer.
   */
  loadBits(bits: number): void {
    while (this.bits < bits) {
      this.bitBuffer += this.uint8array[this.index] << this.bits;
      this.bits += 8;
      this.index += 1;
    }
  }
}
