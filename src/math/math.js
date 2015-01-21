Math.TO_RAD = Math.PI / 180;
Math.TO_DEG = 180 / Math.PI;

/**
 * Convert from degrees to radians.
 *
 * @param {number} degrees
 * @returns {number} Radians.
 */
Math.toRad = function (degrees) {
    return degrees * Math.TO_RAD;
};

/**
 * Convert from radians to degrees.
 *
 * @param {number} radians
 * @returns {number} Degrees.
 */
Math.toDeg = function (radians) {
    return radians * Math.TO_DEG;
};

/**
 * Convert an array of numbers from degrees to radians.
 *
 * @param {number} degrees
 * @returns {number} Radians.
 */
Array.toRad = function (degrees) {
    var arr = [],
          i,
          l;
    
    for (i = 0, l = degrees.length; i < l; i++) {
        arr[i] = degrees[i] * Math.TO_RAD;
    }
    
    return arr;
};

/**
 * Convert an array of numbers from radians to degrees.
 *
 * @param {number} radians
 * @returns {number} Degrees.
 */
Array.toDeg = function (radians) {
    var arr = [],
          i,
          l;
    
    for (i = 0, l = radians.length; i < l; i++) {
        arr[i] = radians[i] * Math.TO_DEG;
    }
    
    return arr;
};

/**
 * Gets a random number in the given range.
 *
 * @param {number} a
 * @param {number} b
 * @returns {number} A random number in [a, b].
 */
Math.randomRange = function (a, b) {
    return a + Math.random() * (b - a);
};

/**
 * Sets the float precision of a number.
 *
 * @param {number} number
 * @param {number} decimals The number of decimals to keep.
 * @returns {number} New number.
 */
Math.setFloatPrecision = function (number, decimals) {
    var multiplier = Math.pow(10, decimals);

    return Math.round(number * multiplier) / multiplier;
};

/**
 * Sets the float precision of an array of numbers.
 *
 * @param {array} array
 * @param {number} decimals The number of decimals to keep.
 * @returns {number} Array of new numbers.
 */
Array.setFloatPrecision = function (array, decimals) {
    var multiplier = Math.pow(10, decimals),
          arr = [],
          i,
          l;

    for (i = 0, l = array.length; i < l; i++) {
        arr[i] = Math.round(array[i] * multiplier) / multiplier;
    }

    return arr;
};

/**
 * Clamp a number in a range.
 *
 * @param {number} x
 * @param {number} minVal
 * @param {number} maxVal
 * @returns {number} Clamped number.
 */
Math.clamp = function (x, minVal, maxVal) {
    return Math.min(Math.max(x, minVal), maxVal);
};

/**
 * Linear interpolation between to numbers.
 *
 * @param {number} a First number.
 * @param {number} b Second number.
 * @param {number} t Factor.
 * @returns {number} Interpolated value.
 */
Math.lerp = function (a, b, t) {
    return a + t * (b - a);
};

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
Math.hermite = function (a, b, c, d, t) {
    var factorTimes2 = t * t,
          factor1 = factorTimes2 * (2 * t - 3) + 1,
          factor2 = factorTimes2 * (t - 2) + t,
          factor3 = factorTimes2 * (t - 1),
          factor4 = factorTimes2 * (3 - 2 * t);

    return (a * factor1) + (b * factor2) + (c * factor3) + (d * factor4);
};

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
Math.bezier = function (a, b, c, d, t) {
    var invt = 1 - t,
          factorTimes2 = t * t,
          inverseFactorTimesTwo = invt * invt,
          factor1 = inverseFactorTimesTwo * invt,
          factor2 = 3 * t * inverseFactorTimesTwo,
          factor3 = 3 * factorTimes2 * invt,
          factor4 = factorTimes2 * t;

    return (a * factor1) + (b * factor2) + (c * factor3) + (d * factor4);
};

/**
 * Gets the sign of a number.
 *
 * @param {number} x
 * @returns {number} The sign.
 */
Math.sign = function (x) {
    return x === 0 ? 0 : (x < 0 ? -1 : 1);
};

/**
 * Copies the sign of one number onto another.
 *
 * @param {number} x Destination.
 * @param {number} y Source.
 * @returns {number} Returns the destination with the source's sign.
 */
Math.copysign = function (x, y) {
    var signy = sign(y),
          signx;

    if (signy === 0) {
        return 0;
    }

    signx = sign(x);

    if (signx !== signy) {
        return -x;
    }

    return x;
};

/**
 * Gets the closest power of two bigger than the given number.
 *
 * @param {number} x
 * @returns {number} A power of two number.
 */
Math.powerOfTwo = function (x) {
    x--;
    x |= x >> 1; 
    x |= x >> 2; 
    x |= x >> 4; 
    x |= x >> 8; 
    x |= x >> 16; 
    x++;

    return x;
};