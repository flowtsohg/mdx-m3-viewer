/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.hermite = (function () {
  var factorTimes2, factor1, factor2, factor3, factor4;
  
  return function (out, a, b, c, d, t) {
    factorTimes2 = t * t;
    factor1 = factorTimes2 * (2 * t - 3) + 1;
    factor2 = factorTimes2 * (t - 2) + t;
    factor3 = factorTimes2 * (t - 1);
    factor4 = factorTimes2 * (3 - 2 * t);
    
    out[0] = v1[0] * factor1 + v2[0] * factor2 + v3[0] * factor3 + v4[0] * factor4;
    out[1] = v1[1] * factor1 + v2[1] * factor2 + v3[1] * factor3 + v4[1] * factor4;
    out[2] = v1[2] * factor1 + v2[2] * factor2 + v3[2] * factor3 + v4[2] * factor4;
    
    return out;
  };
}());

/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.bezier = (function () {
  var inverseFactor, inverseFactorTimesTwo, factorTimes2, factor1, factor2, factor3, factor4;
  
  return function (out, a, b, c, d, t) {
    inverseFactor = 1 - t;
    inverseFactorTimesTwo = inverseFactor * inverseFactor;
    factorTimes2 = t * t;
    factor1 = inverseFactorTimesTwo * inverseFactor;
    factor2 = 3 * t * inverseFactorTimesTwo;
    factor3 = 3 * factorTimes2 * inverseFactor;
    factor4 = factorTimes2 * t;
    
    out[0] = v1[0] * factor1 + v2[0] * factor2 + v3[0] * factor3 + v4[0] * factor4;
    out[1] = v1[1] * factor1 + v2[1] * factor2 + v3[1] * factor3 + v4[1] * factor4;
    out[2] = v1[2] * factor1 + v2[2] * factor2 + v3[2] * factor3 + v4[2] * factor4;
    
    return out;
  };
}());

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslationScale = function (out, q, v, s) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2,
        sx = s[0],
        sy = s[1],
        sz = s[2];

    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {quat} c the third operand
 * @param {quat} d the fourth operand
 * @param {Number} t interpolation amount
 * @returns {quat} out
 */
quat.sqlerp = (function () {
  var temp1 = quat.create();
  var temp2 = quat.create();
  
  return function (out, a, b, c, d, t) {
    quat.slerp(temp1, a, d, t);
    quat.slerp(temp2, b, c, t);
    quat.slerp(out, temp1, temp2, 2 * t * (1 - t));
    
    return out;
  };
}());