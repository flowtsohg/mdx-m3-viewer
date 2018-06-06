/**
 * Convert from degrees to radians.
 *
 * @param {number} degrees
 * @return {number} Radians.
 */
export function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Convert from radians to degrees.
 *
 * @param {number} radians
 * @return {number} Degrees.
 */
export function radToDeg(radians) {
  return radians * (180 / Math.PI);
}

/**
 * Gets a random number in the given range.
 *
 * @param {number} a
 * @param {number} b
 * @return {number} A random number in [a, b].
 */
export function randomInRange(a, b) {
  return a + Math.random() * (b - a);
}

/**
 * Clamp a number in a range.
 *
 * @param {number} x
 * @param {number} minVal
 * @param {number} maxVal
 * @return {number} Clamped number.
 */
export function clamp(x, minVal, maxVal) {
  return Math.min(Math.max(x, minVal), maxVal);
}

/**
 * Linear interpolation between to numbers.
 *
 * @param {number} a First number.
 * @param {number} b Second number.
 * @param {number} t Factor.
 * @return {number} Interpolated value.
 */
export function lerp(a, b, t) {
  return a + t * (b - a);
}

/**
 * Hermite interpolation between to numbers.
 *
 * @param {number} a First number.
 * @param {number} b First control point.
 * @param {number} c Second control point.
 * @param {number} d Second number.
 * @param {number} t Factor.
 * @return {number} Interpolated value.
 */
export function hermite(a, b, c, d, t) {
  let factorTimes2 = t * t;
  let factor1 = factorTimes2 * (2 * t - 3) + 1;
  let factor2 = factorTimes2 * (t - 2) + t;
  let factor3 = factorTimes2 * (t - 1);
  let factor4 = factorTimes2 * (3 - 2 * t);

  return (a * factor1) + (b * factor2) + (c * factor3) + (d * factor4);
}

/**
 * Bezier interpolation between to numbers.
 *
 * @param {number} a First number.
 * @param {number} b First control point.
 * @param {number} c Second control point.
 * @param {number} d Second number.
 * @param {number} t Factor.
 * @return {number} Interpolated value.
 */
export function bezier(a, b, c, d, t) {
  let invt = 1 - t;
  let factorTimes2 = t * t;
  let inverseFactorTimesTwo = invt * invt;
  let factor1 = inverseFactorTimesTwo * invt;
  let factor2 = 3 * t * inverseFactorTimesTwo;
  let factor3 = 3 * factorTimes2 * invt;
  let factor4 = factorTimes2 * t;

  return (a * factor1) + (b * factor2) + (c * factor3) + (d * factor4);
}

/**
 * Copies the sign of one number onto another.
 *
 * @param {number} x Destination.
 * @param {number} y Source.
 * @return {number} Returns the destination with the source's sign.
 */
export function copysign(x, y) {
  let signy = Math.sign(y);

  if (signy === 0) {
    return 0;
  }

  let signx = Math.sign(x);

  if (signx !== signy) {
    return -x;
  }

  return x;
}

/**
 * Gets the closest power of two bigger or equal to the given number.
 *
 * @param {number} x
 * @return {number} A power of two number.
 */
export function powerOfTwo(x) {
  x--;
  x |= x >> 1;
  x |= x >> 2;
  x |= x >> 4;
  x |= x >> 8;
  x |= x >> 16;
  x++;

  return x;
}

/**
 * Is this number a power of two?
 *
 * @param {number} x
 * @return {boolean}
 */
export function isPowerOfTwo(x) {
  if (x === 0) {
    return false;
  }

  return ((x & (x - 1)) === 0);
}
