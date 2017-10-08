/**
 * Converts between a 4 character ASCII tag and it's unsigned integer representation.
 *
 * @param {string} tag
 * @returns {number}
 */
export function tagToUint(tag) {
    return (tag.charCodeAt(0) << 24) + (tag.charCodeAt(1) << 16) + (tag.charCodeAt(2) << 8) + tag.charCodeAt(3);
}


/**
 * Converts between an unsigned integer and it's ASCII representation.
 *
 * @param {number} uint
 * @returns {string}
 */
export function uintToTag(uint) {
    return String.fromCharCode((uint >> 24) & 0xff, (uint >> 16) & 0xff, (uint >> 8) & 0xff, uint & 0xff);
}

/**
 * Encodes two 0-255 numbers into one.
 *
 * @param {number} x The first number.
 * @param {number} y The second number.
 * @returns {number} The encoded number.
 */
export function encodeFloat2(x, y) {
    return x + y * 256;
}

/**
 * Decodes a previously encoded number into the two original numbers.
 *
 * @param {number} f The input.
 * @returns {array} The two decoded numbers.
 */
export function decodeFloat2(f) {
    var v = new Float32Array(2);

    v[1] = Math.floor(f / 256);
    v[0] = Math.floor(f - v[1] * 256);

    return v;
}

/**
 * Encodes three 0-255 numbers into one.
 *
 * @param {number} x The first number.
 * @param {number} y The second number.
 * @param {number} z The third number.
 * @returns {number} The encoded number.
 */
export function encodeFloat3(x, y, z) {
    return x + y * 256 + z * 65536;
}

/**
 * Decodes a previously encoded number into the three original numbers.
 *
 * @param {number} f The input.
 * @returns {array} The three decoded numbers.
 */
export function decodeFloat3(f) {
    var v = new Float32Array(3);

    v[2] = Math.floor(f / 65536);
    v[1] = Math.floor((f - v[2] * 65536) / 256);
    v[0] = Math.floor(f - v[2] * 65536 - v[1] * 256);

    return v;
}

/**
 * Convert from degrees to radians.
 *
 * @param {number} degrees
 * @returns {number} Radians.
 */
export function toRad (degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Convert from radians to degrees.
 *
 * @param {number} radians
 * @returns {number} Degrees.
 */
export function toDeg(radians) {
    return radians * (180 / Math.PI);
}

/**
 * Gets a random number in the given range.
 *
 * @param {number} a
 * @param {number} b
 * @returns {number} A random number in [a, b].
 */
export function randomRange(a, b) {
    return a + Math.random() * (b - a);
}

/**
 * Clamp a number in a range.
 *
 * @param {number} x
 * @param {number} minVal
 * @param {number} maxVal
 * @returns {number} Clamped number.
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
 * @returns {number} Interpolated value.
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
 * @returns {number} Interpolated value.
 */
export function hermite(a, b, c, d, t) {
    var factorTimes2 = t * t,
        factor1 = factorTimes2 * (2 * t - 3) + 1,
        factor2 = factorTimes2 * (t - 2) + t,
        factor3 = factorTimes2 * (t - 1),
        factor4 = factorTimes2 * (3 - 2 * t);

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
 * @returns {number} Interpolated value.
 */
export function bezier(a, b, c, d, t) {
    var invt = 1 - t,
        factorTimes2 = t * t,
        inverseFactorTimesTwo = invt * invt,
        factor1 = inverseFactorTimesTwo * invt,
        factor2 = 3 * t * inverseFactorTimesTwo,
        factor3 = 3 * factorTimes2 * invt,
        factor4 = factorTimes2 * t;

    return (a * factor1) + (b * factor2) + (c * factor3) + (d * factor4);
}

/**
 * Copies the sign of one number onto another.
 *
 * @param {number} x Destination.
 * @param {number} y Source.
 * @returns {number} Returns the destination with the source's sign.
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
 * @returns {number} A power of two number.
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
 * @returns {boolean}
 */
export function isPowerOfTwo(x) {
    if (x === 0) {
        return false;
    }

    return ((x & (x - 1)) === 0);
}
