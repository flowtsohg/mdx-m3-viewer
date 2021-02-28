/**
 * Convert from degrees to radians.
 */
export function degToRad(degrees: number) {
  return degrees * (Math.PI / 180);
}

/**
 * Convert from radians to degrees.
 */
export function radToDeg(radians: number) {
  return radians * (180 / Math.PI);
}

/**
 * Gets a random number between a range.
 */
export function randomInRange(a: number, b: number) {
  return a + Math.random() * (b - a);
}

/**
 * Clamp a number in a range.
 */
export function clamp(x: number, minVal: number, maxVal: number) {
  return Math.min(Math.max(x, minVal), maxVal);
}

/**
 * Linear interpolation.
 */
export function lerp(a: number, b: number, t: number) {
  return a + t * (b - a);
}

/**
 * Hermite interpolation.
 */
export function hermite(a: number, b: number, c: number, d: number, t: number) {
  let factorTimes2 = t * t;
  let factor1 = factorTimes2 * (2 * t - 3) + 1;
  let factor2 = factorTimes2 * (t - 2) + t;
  let factor3 = factorTimes2 * (t - 1);
  let factor4 = factorTimes2 * (3 - 2 * t);

  return (a * factor1) + (b * factor2) + (c * factor3) + (d * factor4);
}

/**
 * Bezier interpolation.
 */
export function bezier(a: number, b: number, c: number, d: number, t: number) {
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
 */
export function copysign(x: number, y: number) {
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
 */
export function powerOfTwo(x: number) {
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
 */
export function isPowerOfTwo(x: number) {
  if (x === 0) {
    return false;
  }

  return ((x & (x - 1)) === 0);
}
