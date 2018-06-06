let buffer = new ArrayBuffer(8);
let int8 = new Int8Array(buffer);
let int16 = new Int16Array(buffer);
let int32 = new Int32Array(buffer);
let uint8 = new Uint8Array(buffer);
let uint16 = new Uint16Array(buffer);
let uint32 = new Uint32Array(buffer);
let float32 = new Float32Array(buffer);
let float64 = new Float64Array(buffer);

/**
 * Type cast a 8 bit unsigned integer to a 8 bits signed integer.
 *
 * @param {number} a
 * @return {number}
 */
export function uint8ToInt8(a) {
  uint8[0] = a;

  return int8[0];
}

/**
 * Type cast two 8 bit unsigned integers to a 16 bits signed integer.
 *
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
export function uint8ToInt16(a, b) {
  uint8[0] = a;
  uint8[1] = b;

  return int16[0];
}

/**
 * Type cast four 8 bit unsigned integers to a 32 bits signed integer.
 *
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @return {number}
 */
export function uint8ToInt32(a, b, c, d) {
  uint8[0] = a;
  uint8[1] = b;
  uint8[2] = c;
  uint8[3] = d;

  return int32[0];
}

/**
 * Type cast two 8 bit unsigned integers to a 16 bits unsigned integer.
 *
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
export function uint8ToUint16(a, b) {
  uint8[0] = a;
  uint8[1] = b;

  return uint16[0];
}

/**
 * Type cast three 8 bit unsigned integers to a 24 bits unsigned integer.
 *
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @return {number}
 */
export function uint8ToUint24(a, b, c) {
  uint8[0] = a;
  uint8[1] = b;
  uint8[2] = c;
  uint8[3] = 0;

  return uint32[0];
}

/**
 * Type cast four 8 bit unsigned integers to a 32 bits unsigned integer.
 *
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @return {number}
 */
export function uint8ToUint32(a, b, c, d) {
  uint8[0] = a;
  uint8[1] = b;
  uint8[2] = c;
  uint8[3] = d;

  return uint32[0];
}

/**
 * Type cast four 8 bit unsigned integers to a 32 bits IEEE float.
 *
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @return {number}
 */
export function uint8ToFloat32(a, b, c, d) {
  uint8[0] = a;
  uint8[1] = b;
  uint8[2] = c;
  uint8[3] = d;

  return float32[0];
}

/**
 * Type cast eight 8 bit unsigned integers to a 64 bits IEEE float.
 *
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @param {number} e
 * @param {number} f
 * @param {number} g
 * @param {number} h
 * @return {number}
 */
export function uint8ToFloat64(a, b, c, d, e, f, g, h) {
  uint8[0] = a;
  uint8[1] = b;
  uint8[2] = c;
  uint8[3] = d;
  uint8[4] = e;
  uint8[5] = f;
  uint8[6] = g;
  uint8[7] = h;

  return float64[0];
}

/**
 * Type cast a 8 bit signed integer to a 8 bit unsigned integer.
 *
 * @param {number} a
 * @return {number}
 */
export function int8ToUint8(a) {
  uint8[0] = a;

  return int8[0];
}

/**
 * Type cast a 16 bit signed integer to two 8 bit unsigned integers.
 * The result is stored in out.
 *
 * @param {Uint8Array} out
 * @param {number} a
 * @return {Uint8Array}
 */
export function int16ToUint8(out, a) {
  int16[0] = a;

  out[0] = uint8[0];
  out[1] = uint8[1];

  return out;
}

/**
 * Type cast a 24 bit signed integer to three 8 bit unsigned integers.
 * The result is stored in out.
 *
 * @param {Uint8Array} out
 * @param {number} a
 * @return {Uint8Array}
 */
export function int24ToUint8(out, a) {
  int32[0] = a;

  out[0] = uint8[0];
  out[1] = uint8[1];
  out[2] = uint8[2];

  return out;
}

/**
 * Type cast a 32 bit signed integer to four 8 bit unsigned integers.
 * The result is stored in out.
 *
 * @param {Uint8Array} out
 * @param {number} a
 * @return {Uint8Array}
 */
export function int32ToUint8(out, a) {
  int32[0] = a;

  out[0] = uint8[0];
  out[1] = uint8[1];
  out[2] = uint8[2];
  out[3] = uint8[3];

  return out;
}

/**
 * Type cast a 16 bit unsigned integer to two 8 bit unsigned integers.
 * The result is stored in out.
 *
 * @param {Uint8Array} out
 * @param {number} a
 * @return {Uint8Array}
 */
export function uint16ToUint8(out, a) {
  uint16[0] = a;

  out[0] = uint8[0];
  out[1] = uint8[1];

  return out;
}

/**
 * Type cast a 24 bit unsigned integer to three 8 bit unsigned integers.
 * The result is stored in out.
 *
 * @param {Uint8Array} out
 * @param {number} a
 * @return {Uint8Array}
 */
export function uint24ToUint8(out, a) {
  uint32[0] = a;

  out[0] = uint8[0];
  out[1] = uint8[1];
  out[2] = uint8[2];

  return out;
}

/**
 * Type cast a 32 bit unsigned integer to four 8 bit unsigned integers.
 * The result is stored in out.
 *
 * @param {Uint8Array} out
 * @param {number} a
 * @return {Uint8Array}
 */
export function uint32ToUint8(out, a) {
  uint32[0] = a;

  out[0] = uint8[0];
  out[1] = uint8[1];
  out[2] = uint8[2];
  out[3] = uint8[3];

  return out;
}

/**
 * Type cast a 32 bit IEEE float to four 8 bit unsigned integers.
 * The result is stored in out.
 *
 * @param {Uint8Array} out
 * @param {number} a
 * @return {Uint8Array}
 */
export function float32ToUint8(out, a) {
  float32[0] = a;

  out[0] = uint8[0];
  out[1] = uint8[1];
  out[2] = uint8[2];
  out[3] = uint8[3];

  return out;
}

/**
 * Type cast a 64 bit IEEE float to eight 8 bit unsigned integers.
 * The result is stored in out.
 *
 * @param {Uint8Array} out
 * @param {number} a
 * @return {Uint8Array}
 */
export function float64ToUint8(out, a) {
  float64[0] = a;

  out[0] = uint8[0];
  out[1] = uint8[1];
  out[2] = uint8[2];
  out[3] = uint8[3];
  out[4] = uint8[4];
  out[5] = uint8[5];
  out[6] = uint8[6];
  out[7] = uint8[7];

  return out;
}

/**
 * Type cast a normal JavaScript number to a 32 bits unsigned integer.
 *
 * @param {number} number
 * @return {number}
 */
export function numberToUint32(number) {
  uint32[0] = number;

  return uint32[0];
}

/**
 * Interperts a string as a base 256 number.
 *
 * @param {string} string
 * @return {number}
 */
export function stringToBase256(string) {
  let number = 0;

  for (let c of string) {
    number = number * 256 + c.charCodeAt(0);
  }

  return number;
}

/**
 * Interperts a number as a base 256 string.
 *
 * @param {number} number
 * @return {string}
 */
export function base256ToString(number) {
  let array = [];

  while (number > 0) {
    array.push(String.fromCharCode(number % 256));
    number = Math.floor(number / 256);
  }

  return array.reverse().join('');
}
