import { uint8ToInt8, uint8ToInt16, uint8ToInt32, uint8ToUint16, uint8ToUint32, uint8ToFloat32, uint8ToFloat64, int8ToUint8, int16ToUint8, int32ToUint8, uint16ToUint8, uint32ToUint8, float32ToUint8, float64ToUint8 } from './typecast';

// Memory for all of the xxxToUint type casts.
const uint8 = new Uint8Array(8);

/**
 * A binary stream.
 */
export default class BinaryStream {
  buffer: ArrayBuffer;
  uint8array: Uint8Array;
  index: number = 0;
  byteLength: number;

  constructor(buffer: ArrayBuffer | TypedArray, byteOffset?: number, byteLength?: number) {
    // If given a view, use its properties.
    if (ArrayBuffer.isView(buffer)) {
      byteOffset = buffer.byteOffset;
      byteLength = buffer.byteLength;
      buffer = buffer.buffer;
    }

    if (!(buffer instanceof ArrayBuffer)) {
      throw new TypeError(`BinaryStream: expected ArrayBuffer or TypedArray, got ${buffer}`);
    }

    // For browsers not supporting the spec.
    // Once upon a time I reported this issue on the Firefox tracker.
    // Seems like Safari needs an issue report too.
    byteOffset = byteOffset || 0;
    byteLength = byteLength || buffer.byteLength;

    this.buffer = buffer;
    this.uint8array = new Uint8Array(buffer, byteOffset, byteLength);
    this.byteLength = byteLength;
  }

  /**
   * Create a subreader of this reader, at its position, with the given byte length.
   */
  substream(byteLength: number) {
    return new BinaryStream(this.buffer, this.index, byteLength);
  }

  /**
   * Get the remaining bytes.
   */
  remaining() {
    return this.byteLength - this.index;
  }

  /**
   * Skip a number of bytes.
   */
  skip(bytes: number) {
    this.index += bytes;
  }

  /**
   * Set the reader's index.
   */
  seek(index: number) {
    this.index = index;
  }

  /**
   * Get the reader's index.
   */
  tell() {
    return this.index;
  }

  /**
   * Peek a string.
   */
  peek(size: number, allowNulls: boolean = false) {
    let uint8array = this.uint8array;
    let index = this.index;
    let data = '';

    for (let i = 0; i < size; i++) {
      let b = uint8array[index + i];

      // Avoid \0
      if (allowNulls || b > 0) {
        data += String.fromCharCode(b);
      }
    }

    return data;
  }

  /**
   * Read a string.
   */
  read(size: number, allowNulls: boolean = false) {
    // If the size isn't specified, default to everything
    size = size || this.remaining();

    let data = this.peek(size, allowNulls);

    this.index += size;

    return data;
  }

  /**
   * Peeks a string until finding a null byte.
   */
  peekUntilNull() {
    let uint8array = this.uint8array;
    let index = this.index;
    let data = '';
    let b = uint8array[index];
    let i = 0;

    while (b !== 0) {
      data += String.fromCharCode(b);

      i += 1;
      b = uint8array[index + i];
    }

    return data;
  }

  /**
   * Read a string until finding a null byte.
   */
  readUntilNull() {
    let data = this.peekUntilNull();

    this.index += data.length + 1; // +1 for the \0 itself

    return data;
  }

  /**
   * Peek a character array.
   */
  peekCharArray(size: number) {
    let uint8array = this.uint8array;
    let index = this.index;
    let data = [];

    for (let i = 0; i < size; i++) {
      data[i] = String.fromCharCode(uint8array[index + i]);
    }

    return data;
  }

  /**
   * Read a character array.
   */
  readCharArray(size: number) {
    let data = this.peekCharArray(size);

    this.index += size;

    return data;
  }

  /**
   * Read a 8 bit signed integer.
   */
  readInt8() {
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToInt8(uint8array[index]);

    this.index += 1;

    return data;
  }

  /**
   * Read a 16 bit signed integer.
   */
  readInt16() {
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToInt16(uint8array[index], uint8array[index + 1]);

    this.index += 2;

    return data;
  }

  /**
   * Read a 32 bit signed integer.
   */
  readInt32() {
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToInt32(uint8array[index], uint8array[index + 1], uint8array[index + 2], uint8array[index + 3]);

    this.index += 4;

    return data;
  }

  /**
   * Read a 8 bit unsigned integer.
   */
  readUint8() {
    let data = this.uint8array[this.index];

    this.index += 1;

    return data;
  }

  /**
   * Read a 16 bit unsigned integer.
   */
  readUint16() {
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToUint16(uint8array[index], uint8array[index + 1]);

    this.index += 2;

    return data;
  }

  /**
   * Read a 32 bit unsigned integer.
   */
  readUint32() {
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToUint32(uint8array[index], uint8array[index + 1], uint8array[index + 2], uint8array[index + 3]);

    this.index += 4;

    return data;
  }

  /**
   * Read a 32 bit float.
   */
  readFloat32() {
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToFloat32(uint8array[index], uint8array[index + 1], uint8array[index + 2], uint8array[index + 3]);

    this.index += 4;

    return data;
  }

  /**
   * Read a 64 bit float.
   */
  readFloat64() {
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToFloat64(uint8array[index], uint8array[index + 1], uint8array[index + 2], uint8array[index + 3], uint8array[index + 4], uint8array[index + 5], uint8array[index + 6], uint8array[index + 7]);

    this.index += 8;

    return data;
  }

  /**
   * Read an array of 8 bit signed integers.
   */
  readInt8Array(view: number | Int8Array) {
    if (!ArrayBuffer.isView(view)) {
      view = new Int8Array(view);
    }

    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      view[i] = uint8ToInt8(uint8array[index + i]);
    }

    this.index += view.byteLength;

    return view;
  }

  /**
   * Read an array of 16 bit signed integers.
   */
  readInt16Array(view: number | Int16Array) {
    if (!ArrayBuffer.isView(view)) {
      view = new Int16Array(view);
    }

    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 2;

      view[i] = uint8ToInt16(uint8array[offset], uint8array[offset + 1]);
    }

    this.index += view.byteLength;

    return view;
  }

  /**
   * Read an array of 32 bit signed integers.
   */
  readInt32Array(view: number | Int32Array) {
    if (!ArrayBuffer.isView(view)) {
      view = new Int32Array(view);
    }

    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 4;

      view[i] = uint8ToInt32(uint8array[offset], uint8array[offset + 1], uint8array[offset + 2], uint8array[offset + 3]);
    }

    this.index += view.byteLength;

    return view;
  }

  /**
   * Read an array of 8 bit unsigned integers.
   */
  readUint8Array(view: number | Uint8Array) {
    if (!ArrayBuffer.isView(view)) {
      view = new Uint8Array(view);
    }

    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      view[i] = uint8array[index + i];
    }

    this.index += view.byteLength;

    return view;
  }

  /**
   * Read an array of 16 bit unsigned integers.
   */
  readUint16Array(view: number | Uint16Array) {
    if (!ArrayBuffer.isView(view)) {
      view = new Uint16Array(view);
    }

    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 2;

      view[i] = uint8ToUint16(uint8array[offset], uint8array[offset + 1]);
    }

    this.index += view.byteLength;

    return view;
  }

  /**
   * Read an array of 32 bit unsigned integers.
   */
  readUint32Array(view: number | Uint32Array) {
    if (!ArrayBuffer.isView(view)) {
      view = new Uint32Array(view);
    }

    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 4;

      view[i] = uint8ToUint32(uint8array[offset], uint8array[offset + 1], uint8array[offset + 2], uint8array[offset + 3]);
    }

    this.index += view.byteLength;

    return view;
  }

  /**
   * Read an array of 32 bit floats.
   */
  readFloat32Array(view: number | Float32Array) {
    if (!ArrayBuffer.isView(view)) {
      view = new Float32Array(view);
    }

    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 4;

      view[i] = uint8ToFloat32(uint8array[offset], uint8array[offset + 1], uint8array[offset + 2], uint8array[offset + 3]);
    }

    this.index += view.byteLength;

    return view;
  }

  /**
   * Read an array of 64 bit floats.
   */
  readFloat64Array(view: number | Float64Array) {
    if (!ArrayBuffer.isView(view)) {
      view = new Float64Array(view);
    }

    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 8;

      view[i] = uint8ToFloat64(uint8array[offset], uint8array[offset + 1], uint8array[offset + 2], uint8array[offset + 3], uint8array[offset + 4], uint8array[offset + 5], uint8array[offset + 6], uint8array[offset + 7]);
    }

    this.index += view.byteLength;

    return view;
  }

  /**
   * Write a string.
   */
  write(value: string) {
    let index = this.index;
    let uint8array = this.uint8array;
    let count = value.length;

    for (let i = 0; i < count; i++) {
      uint8array[index + i] = value.charCodeAt(i);
    }

    this.index += count;
  }

  /**
   * Write a 8 bit signed integer.
   */
  writeInt8(value: number) {
    this.uint8array[this.index] = int8ToUint8(value);
    this.index += 1;
  }

  /**
   * Write a 16 bit signed integer.
   */
  writeInt16(value: number) {
    let index = this.index;
    let uint8array = this.uint8array;

    int16ToUint8(uint8, value);

    uint8array[index] = uint8[0];
    uint8array[index + 1] = uint8[1];

    this.index += 2;
  }

  /**
   * Write a 32 bit signed integer.
   */
  writeInt32(value: number) {
    let index = this.index;
    let uint8array = this.uint8array;

    int32ToUint8(uint8, value);

    uint8array[index] = uint8[0];
    uint8array[index + 1] = uint8[1];
    uint8array[index + 2] = uint8[2];
    uint8array[index + 3] = uint8[3];

    this.index += 4;
  }

  /**
   * Write a 8 bit unsigned integer.
   */
  writeUint8(value: number) {
    this.uint8array[this.index] = value;
    this.index += 1;
  }

  /**
   * Write a 16 bit unsigned integer.
   */
  writeUint16(value: number) {
    let index = this.index;
    let uint8array = this.uint8array;

    uint16ToUint8(uint8, value);

    uint8array[index] = uint8[0];
    uint8array[index + 1] = uint8[1];

    this.index += 2;
  }

  /**
   * Write a 32 bit unsigned integer.
   */
  writeUint32(value: number) {
    let index = this.index;
    let uint8array = this.uint8array;

    uint32ToUint8(uint8, value);

    uint8array[index] = uint8[0];
    uint8array[index + 1] = uint8[1];
    uint8array[index + 2] = uint8[2];
    uint8array[index + 3] = uint8[3];

    this.index += 4;
  }

  /**
   * Write a 32 bit float.
   */
  writeFloat32(value: number) {
    let index = this.index;
    let uint8array = this.uint8array;

    float32ToUint8(uint8, value);

    uint8array[index] = uint8[0];
    uint8array[index + 1] = uint8[1];
    uint8array[index + 2] = uint8[2];
    uint8array[index + 3] = uint8[3];

    this.index += 4;
  }

  /**
   * Write a 64 bit float.
   */
  writeFloat64(value: number) {
    let index = this.index;
    let uint8array = this.uint8array;

    float64ToUint8(uint8, value);

    uint8array[index] = uint8[0];
    uint8array[index + 1] = uint8[1];
    uint8array[index + 2] = uint8[2];
    uint8array[index + 3] = uint8[3];
    uint8array[index + 4] = uint8[4];
    uint8array[index + 5] = uint8[5];
    uint8array[index + 6] = uint8[6];
    uint8array[index + 7] = uint8[7];

    this.index += 8;
  }

  /**
   * Write an array of 8 bit signed integers.
   */
  writeInt8Array(view: Int8Array) {
    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      uint8array[index + i] = int8ToUint8(view[i]);
    }

    this.index += view.byteLength;
  }

  /**
   * Write an array of 16 bit signed integers.
   */
  writeInt16Array(view: Int16Array) {
    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 2;

      int16ToUint8(uint8, view[i]);

      uint8array[offset] = uint8[0];
      uint8array[offset + 1] = uint8[1];
    }

    this.index += view.byteLength;
  }

  /**
   * Write an array of 32 bit signed integers.
   */
  writeInt32Array(view: Int32Array) {
    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 4;

      int32ToUint8(uint8, view[i]);

      uint8array[offset] = uint8[0];
      uint8array[offset + 1] = uint8[1];
      uint8array[offset + 2] = uint8[2];
      uint8array[offset + 3] = uint8[3];
    }

    this.index += view.byteLength;
  }

  /**
   * Write an array of 8 bit unsigned integers.
   */
  writeUint8Array(view: Uint8Array) {
    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      uint8array[index + i] = view[i];
    }

    this.index += view.byteLength;
  }

  /**
   * Write an array of 16 bit unsigned integers.
   */
  writeUint16Array(view: Uint16Array) {
    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 2;

      uint16ToUint8(uint8, view[i]);

      uint8array[offset] = uint8[0];
      uint8array[offset + 1] = uint8[1];
    }

    this.index += view.byteLength;
  }

  /**
   * Write an array of 32 bit unsigned integers.
   */
  writeUint32Array(view: Uint32Array) {
    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 4;

      uint32ToUint8(uint8, view[i]);

      uint8array[offset] = uint8[0];
      uint8array[offset + 1] = uint8[1];
      uint8array[offset + 2] = uint8[2];
      uint8array[offset + 3] = uint8[3];
    }

    this.index += view.byteLength;
  }

  /**
   * Write an array of 32 bit floats.
   */
  writeFloat32Array(view: Float32Array) {
    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 4;

      float32ToUint8(uint8, view[i]);

      uint8array[offset] = uint8[0];
      uint8array[offset + 1] = uint8[1];
      uint8array[offset + 2] = uint8[2];
      uint8array[offset + 3] = uint8[3];
    }

    this.index += view.byteLength;
  }

  /**
   * Write an array of 64 bit floats.
   */
  writeFloat64Array(view: Float64Array) {
    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 8;

      float64ToUint8(uint8, view[i]);

      uint8array[offset] = uint8[0];
      uint8array[offset + 1] = uint8[1];
      uint8array[offset + 2] = uint8[2];
      uint8array[offset + 3] = uint8[3];
      uint8array[offset + 4] = uint8[4];
      uint8array[offset + 5] = uint8[5];
      uint8array[offset + 6] = uint8[6];
      uint8array[offset + 7] = uint8[7];
    }

    this.index += view.byteLength;
  }
}
