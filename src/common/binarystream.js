import {uint8ToInt8, uint8ToInt16, uint8ToInt32, uint8ToUint16, uint8ToUint32, uint8ToFloat32, uint8ToFloat64, int8ToUint8, int16ToUint8, int32ToUint8, uint16ToUint8, uint32ToUint8, float32ToUint8, float64ToUint8} from './typecast';

// Memory for all of the xxxToUint type casts.
let uint8 = new Uint8Array(8);

/**
 * A binary stream.
 */
export default class BinaryStream {
  /**
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
      throw new TypeError(`BinaryStream: expected ArrayBuffer or ArrayBufferView, got ${buffer}`);
    }

    /** @member {ArrayBuffer} */
    this.buffer = buffer;
    /** @member {Uint8Array} */
    this.uint8array = new Uint8Array(buffer, byteOffset, byteLength);
    /** @member {number} */
    this.index = 0;
    /** @member {number} */
    this.byteLength = buffer.byteLength;
  }

  /**
   * Create a subreader of this reader, at its position, with the given byte length
   *
   * @param {number} byteLength
   * @return {BinaryStream}
   */
  substream(byteLength) {
    return new BinaryStream(this.buffer, this.index, byteLength);
  }

  /**
   * Get the remaining bytes
   *
   * @return {number}
   */
  remaining() {
    return this.byteLength - this.index;
  }

  /**
   * Skip a number of bytes
   *
   * @param {number} bytes
   */
  skip(bytes) {
    this.index += bytes;
  }

  /**
   * Set the reader's index
   *
   * @param {number} index
   */
  seek(index) {
    this.index = index;
  }

  /**
   * Get the reader's index
   *
   * @return {number}
   */
  tell() {
    return this.index;
  }

  /**
   * Peek a string
   *
   * @param {number} size
   * @param {boolean=} allowNulls
   * @return {string}
   */
  peek(size, allowNulls) {
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
   * Read a string
   *
   * @param {number} size
   * @param {boolean=} allowNulls
   * @return {string}
   */
  read(size, allowNulls) {
    // If the size isn't specified, default to everything
    size = size || this.remaining();

    let data = this.peek(size, allowNulls);

    this.index += size;

    return data;
  }

  /**
   * Peeks a string until finding a null byte
   *
   * @return {string}
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
   * Read a string until finding a null byte
   *
   * @param {number} size
   * @return {string}
   */
  readUntilNull() {
    let data = this.peekUntilNull();

    this.index += data.length + 1; // +1 for the \0 itself

    return data;
  }

  /**
   * Peek a character array.
   *
   * @param {number} size
   * @return {Array<string>}
   */
  peekCharArray(size) {
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
   *
   * @param {number} size
   * @return {Array<string>}
   */
  readCharArray(size) {
    let data = this.peekCharArray(size);

    this.index += size;

    return data;
  }

  /**
   * Read a 8 bit signed integer
   *
   * @return {number}
   */
  readInt8() {
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToInt8(uint8array[index]);

    this.index += 1;

    return data;
  }

  /**
   * Read a 16 bit signed integer
   *
   * @return {number}
   */
  readInt16() {
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToInt16(uint8array[index], uint8array[index + 1]);

    this.index += 2;

    return data;
  }

  /**
   * Read a 32 bit signed integer
   *
   * @return {number}
   */
  readInt32() {
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToInt32(uint8array[index], uint8array[index + 1], uint8array[index + 2], uint8array[index + 3]);

    this.index += 4;

    return data;
  }

  /**
   * Read a 8 bit unsigned integer
   *
   * @return {number}
   */
  readUint8() {
    let data = this.uint8array[this.index];

    this.index += 1;

    return data;
  }

  /**
   * Read a 16 bit unsigned integer
   *
   * @return {number}
   */
  readUint16() {
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToUint16(uint8array[index], uint8array[index + 1]);

    this.index += 2;

    return data;
  }

  /**
   * Read a 32 bit unsigned integer
   *
   * @return {number}
   */
  readUint32() {
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToUint32(uint8array[index], uint8array[index + 1], uint8array[index + 2], uint8array[index + 3]);

    this.index += 4;

    return data;
  }

  /**
   * Read a 32 bit float
   *
   * @return {number}
   */
  readFloat32() {
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToFloat32(uint8array[index], uint8array[index + 1], uint8array[index + 2], uint8array[index + 3]);

    this.index += 4;

    return data;
  }

  /**
   * Read a 64 bit float
   *
   * @return {number}
   */
  readFloat64() {
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToFloat64(uint8array[index], uint8array[index + 1], uint8array[index + 2], uint8array[index + 3], uint8array[index + 4], uint8array[index + 5], uint8array[index + 6], uint8array[index + 7]);

    this.index += 8;

    return data;
  }

  /**
   * Read an array of 8 bit signed integers into the given view
   *
   * @param {Int8Array|number} view
   * @return {Int8Array}
   */
  readInt8Array(view) {
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
   * Read an array of 16 bit signed integers into the given view
   *
   * @param {Int16Array|number} view
   * @return {Int16Array}
   */
  readInt16Array(view) {
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
   * Read an array of 32 bit signed integers into the given view
   *
   * @param {Int32Array|number} view
   * @return {Int32Array}
   */
  readInt32Array(view) {
    if (!ArrayBuffer.isView(view)) {
      view = new Int32Array(view);
    }

    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 4;

      view[i] = uint8ToInt16(uint8array[offset], uint8array[offset + 1], uint8array[offset + 2], uint8array[offset + 3]);
    }

    this.index += view.byteLength;

    return view;
  }

  /**
   * Read an array of 8 bit unsigned integers into the given view
   *
   * @param {Uint8Array|number} view
   * @return {Uint8Array}
   */
  readUint8Array(view) {
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
   * Read an array of 16 bit unsigned integers into the given view
   *
   * @param {Uint16Array|number} view
   * @return {Uint16Array}
   */
  readUint16Array(view) {
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
   * Read an array of 32 bit unsigned integers into the given view
   *
   * @param {Uint32Array|number} view
   * @return {Uint32Array}
   */
  readUint32Array(view) {
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
   * Read an array of 32 bit floats into the given view
   *
   * @param {Float32Array|number} view
   * @return {Float32Array}
   */
  readFloat32Array(view) {
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
   * Read an array of 64 bit floats into the given view
   *
   * @param {Float64Array|number} view
   * @return {Float64Array}
   */
  readFloat64Array(view) {
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
   * Read into a typed array.
   *
   * @param {ArrayBufferView} view
   */
  readTypedArray(view) {
    let buffer = new Uint8Array(view.buffer);
    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = buffer.length; i < l; i++) {
      buffer[i] = uint8array[index + i];
    }

    this.index += buffer.length;
  }

  /**
   * Write a string
   *
   * @param {string} value
   */
  write(value) {
    let index = this.index;
    let uint8array = this.uint8array;
    let count = value.length;

    for (let i = 0; i < count; i++) {
      uint8array[index + i] = value.charCodeAt(i);
    }

    this.index += count;
  }

  /**
   * Write a 8 bit signed integer
   *
   * @param {number} value
   */
  writeInt8(value) {
    this.uint8array[this.index] = int8ToUint8(value);
    this.index += 1;
  }

  /**
   * Write a 16 bit signed integer
   *
   * @param {number} value
   */
  writeInt16(value) {
    let index = this.index;
    let uint8array = this.uint8array;

    int16ToUint8(uint8, value);

    uint8array[index] = uint8[0];
    uint8array[index + 1] = uint8[1];

    this.index += 2;
  }

  /**
   * Write a 32 bit signed integer
   *
   * @param {number} value
   */
  writeInt32(value) {
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
   * Write a 8 bit unsigned integer
   *
   * @param {number} value
   */
  writeUint8(value) {
    this.uint8array[this.index] = value;
    this.index += 1;
  }

  /**
   * Write a 16 bit unsigned integer
   *
   * @param {number} value
   */
  writeUint16(value) {
    let index = this.index;
    let uint8array = this.uint8array;

    uint16ToUint8(uint8, value);

    uint8array[index] = uint8[0];
    uint8array[index + 1] = uint8[1];

    this.index += 2;
  }

  /**
   * Write a 32 bit unsigned integer
   *
   * @param {number} value
   */
  writeUint32(value) {
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
   * Write a 32 bit float
   *
   * @param {number} value
   */
  writeFloat32(value) {
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
   * Write a 64 bit float
   *
   * @param {number} value
   */
  writeFloat64(value) {
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
   * Write an array of 8 bit signed integers
   *
   * @param {Int8Array} view
   */
  writeInt8Array(view) {
    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      uint8array[index + i] = int8ToUint8(view[i]);
    }

    this.index += view.byteLength;
  }

  /**
   * Write an array of 16 bit signed integers
   *
   * @param {Int16Array} view
   */
  writeInt16Array(view) {
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
   * Write an array of 32 bit signed integers
   *
   * @param {Int32Array} view
   */
  writeInt32Array(view) {
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
   * Write an array of 8 bit unsigned integers
   *
   * @param {Uint8Array} view
   */
  writeUint8Array(view) {
    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = view.length; i < l; i++) {
      uint8array[index + i] = view[i];
    }

    this.index += view.byteLength;
  }

  /**
   * Write an array of 16 bit unsigned integers
   *
   * @param {Uint16Array} view
   */
  writeUint16Array(view) {
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
   * Write an array of 32 bit unsigned integers
   *
   * @param {Uint32Array} view
   */
  writeUint32Array(view) {
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
   * Write an array of 32 bit floats
   *
   * @param {Float32Array} view
   */
  writeFloat32Array(view) {
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
   * Write an array of 64 bit floats
   *
   * @param {Float64Array} view
   */
  writeFloat64Array(view) {
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

  /**
   * Write a typed array.
   *
   * @param {ArrayBufferView} view
   */
  writeTypedArray(view) {
    let buffer = new Uint8Array(view.buffer);
    let index = this.index;
    let uint8array = this.uint8array;

    for (let i = 0, l = buffer.length; i < l; i++) {
      uint8array[index + i] = buffer[i];
    }
  }
}
