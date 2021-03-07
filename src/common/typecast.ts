const buffer = new ArrayBuffer(8);
const int8 = new Int8Array(buffer);
const int16 = new Int16Array(buffer);
const int32 = new Int32Array(buffer);
const uint8 = new Uint8Array(buffer);
const uint16 = new Uint16Array(buffer);
const uint32 = new Uint32Array(buffer);
const float32 = new Float32Array(buffer);
const float64 = new Float64Array(buffer);

/**
 * Typecast a 8 bit unsigned integer to a 8 bits signed integer.
 */
export function uint8ToInt8(a: number) {
  uint8[0] = a;

  return int8[0];
}

/**
 * Typecast two 8 bit unsigned integers to a 16 bits signed integer.
 */
export function uint8ToInt16(a: number, b: number) {
  uint8[0] = a;
  uint8[1] = b;

  return int16[0];
}

/**
 * Typecast three 8 bit unsigned integers to a 24 bits signed integer.
 */
export function uint8ToInt24(a: number, b: number, c: number) {
  uint8[0] = a;
  uint8[1] = b;
  uint8[2] = c;
  uint8[3] = 0;

  return int32[0];
}

/**
 * Typecast four 8 bit unsigned integers to a 32 bits signed integer.
 */
export function uint8ToInt32(a: number, b: number, c: number, d: number) {
  uint8[0] = a;
  uint8[1] = b;
  uint8[2] = c;
  uint8[3] = d;

  return int32[0];
}

/**
 * Typecast two 8 bit unsigned integers to a 16 bits unsigned integer.
 */
export function uint8ToUint16(a: number, b: number) {
  uint8[0] = a;
  uint8[1] = b;

  return uint16[0];
}

/**
 * Typecast three 8 bit unsigned integers to a 24 bits unsigned integer.
 */
export function uint8ToUint24(a: number, b: number, c: number) {
  uint8[0] = a;
  uint8[1] = b;
  uint8[2] = c;
  uint8[3] = 0;

  return uint32[0];
}

/**
 * Typecast four 8 bit unsigned integers to a 32 bits unsigned integer.
 */
export function uint8ToUint32(a: number, b: number, c: number, d: number) {
  uint8[0] = a;
  uint8[1] = b;
  uint8[2] = c;
  uint8[3] = d;

  return uint32[0];
}

/**
 * Typecast four 8 bit unsigned integers to a 32 bits IEEE float.
 */
export function uint8ToFloat32(a: number, b: number, c: number, d: number) {
  uint8[0] = a;
  uint8[1] = b;
  uint8[2] = c;
  uint8[3] = d;

  return float32[0];
}

/**
 * Typecast eight 8 bit unsigned integers to a 64 bits IEEE float.
 */
export function uint8ToFloat64(a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) {
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
 * Typecast a 8 bit signed integer to a 8 bit unsigned integer.
 */
export function int8ToUint8(a: number) {
  uint8[0] = a;

  return int8[0];
}

/**
 * Typecast a 16 bit signed integer to two 8 bit unsigned integers.
 * 
 * The result is stored in out.
 */
export function int16ToUint8(out: Uint8Array, a: number) {
  int16[0] = a;

  out[0] = uint8[0];
  out[1] = uint8[1];

  return out;
}

/**
 * Typecast a 24 bit signed integer to three 8 bit unsigned integers.
 * 
 * The result is stored in out.
 */
export function int24ToUint8(out: Uint8Array, a: number) {
  int32[0] = a;

  out[0] = uint8[0];
  out[1] = uint8[1];
  out[2] = uint8[2];

  return out;
}

/**
 * Typecast a 32 bit signed integer to four 8 bit unsigned integers.
 * 
 * The result is stored in out.
 */
export function int32ToUint8(out: Uint8Array, a: number) {
  int32[0] = a;

  out[0] = uint8[0];
  out[1] = uint8[1];
  out[2] = uint8[2];
  out[3] = uint8[3];

  return out;
}

/**
 * Typecast a 16 bit unsigned integer to two 8 bit unsigned integers.
 * 
 * The result is stored in out.
 */
export function uint16ToUint8(out: Uint8Array, a: number) {
  uint16[0] = a;

  out[0] = uint8[0];
  out[1] = uint8[1];

  return out;
}

/**
 * Typecast a 24 bit unsigned integer to three 8 bit unsigned integers.
 * 
 * The result is stored in out.
 */
export function uint24ToUint8(out: Uint8Array, a: number) {
  uint32[0] = a;

  out[0] = uint8[0];
  out[1] = uint8[1];
  out[2] = uint8[2];

  return out;
}

/**
 * Typecast a 32 bit unsigned integer to four 8 bit unsigned integers.
 * 
 * The result is stored in out.
 */
export function uint32ToUint8(out: Uint8Array, a: number) {
  uint32[0] = a;

  out[0] = uint8[0];
  out[1] = uint8[1];
  out[2] = uint8[2];
  out[3] = uint8[3];

  return out;
}

/**
 * Typecast a 32 bit IEEE float to four 8 bit unsigned integers.
 * 
 * The result is stored in out.
 */
export function float32ToUint8(out: Uint8Array, a: number) {
  float32[0] = a;

  out[0] = uint8[0];
  out[1] = uint8[1];
  out[2] = uint8[2];
  out[3] = uint8[3];

  return out;
}

/**
 * Typecast a 64 bit IEEE float to eight 8 bit unsigned integers.
 * 
 * The result is stored in out.
 */
export function float64ToUint8(out: Uint8Array, a: number) {
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
 * Typecast a normal JavaScript number to a 32 bits unsigned integer.
 */
export function numberToUint32(number: number) {
  uint32[0] = number;

  return uint32[0];
}

/**
 * Interperts a string as a base 256 number.
 */
export function stringToBase256(string: string) {
  let number = 0;

  for (let c of string) {
    number = number * 256 + c.charCodeAt(0);
  }

  return number;
}

/**
 * Interperts a number as a base 256 string.
 */
export function base256ToString(number: number) {
  let array = [];

  while (number > 0) {
    array.push(String.fromCharCode(number % 256));
    number = Math.floor(number / 256);
  }

  return array.reverse().join('');
}
