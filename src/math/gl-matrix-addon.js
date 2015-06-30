vec3.UNIT_X = vec3.fromValues(1, 0, 0);
vec3.UNIT_Y = vec3.fromValues(0, 1, 0);
vec3.UNIT_Z = vec3.fromValues(0, 0, 1);

vec3.hermite = function (out, a, b, c, d, t) {
    var factorTimes2 = t * t,
        factor1 = factorTimes2 * (2 * t - 3) + 1,
        factor2 = factorTimes2 * (t - 2) + t,
        factor3 = factorTimes2 * (t - 1),
        factor4 = factorTimes2 * (3 - 2 * t);
    
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    
    return out;
};

vec3.bezier = function (out, a, b, c, d, t) {
    var inverseFactor = 1 - t,
        inverseFactorTimesTwo = inverseFactor * inverseFactor,
        factorTimes2 = t * t,
        factor1 = inverseFactorTimesTwo * inverseFactor,
        factor2 = 3 * t * inverseFactorTimesTwo,
        factor3 = 3 * factorTimes2 * inverseFactor,
        factor4 = factorTimes2 * t;
    
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    
    return out;
};

mat4.fromRotationTranslationScale = function (out, q, v, s) {
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

mat4.fromRotationTranslationScaleOrigin = function (out, q, v, s, o) {
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
        sz = s[2],
        ox = o[0],
        oy = o[1],
        oz = o[2];
    
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
    out[12] = v[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
    out[13] = v[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
    out[14] = v[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
    out[15] = 1;
    
    return out;
};

mat4.toRotationMat4 = (function () {
    var quadrent = mat3.create();
    
    return function (out, m) {
        mat3.fromMat4(quadrent, m);
        mat3.invert(quadrent, quadrent);
        
        out[0] = quadrent[0];
        out[1] = quadrent[1];
        out[2] = quadrent[2];
        out[3] = 1;
        out[4] = quadrent[3];
        out[5] = quadrent[4];
        out[6] = quadrent[5];
        out[7] = 1;
        out[8] = quadrent[6];
        out[9] = quadrent[7];
        out[10] = quadrent[8];
        out[11] = 1;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        
        return out;
    };
}());

quat.sqlerp = (function () {
    var temp1 = quat.create(),
        temp2 = quat.create();
    
    return function (out, a, b, c, d, t) {
        quat.slerp(temp1, a, d, t);
        quat.slerp(temp2, b, c, t);
        quat.slerp(out, temp1, temp2, 2 * t * (1 - t));
        
        return out;
    };
}());

mat4.decomposeScale = function (out, m) {
    var m0 = m[0], m1 = m[1], m2 = m[2],
        m4 = m[4], m5 = m[5], m6 = m[6],
        m8 = m[8], m9 = m[9], m10 = m[10];
    
    out[0] = Math.sqrt(m0*m0 + m1*m1 + m2*m2);
    out[1] = Math.sqrt(m4*m4 + m5*m5 + m6*m6);
    out[2] = Math.sqrt(m8*m8 + m9*m9 + m10*m10);
    
    return out;
};

vec3.unproject = (function () {
    var heap = vec4.create();
    
    return function (out, x, y, z, inverseMatrix, viewport) {
        x = 2 * (x - viewport[0]) / viewport[2] - 1;
        y = 1 - 2 * (y - viewport[1]) / viewport[3];
        z = 2 * z - 1;
        
        vec4.set(heap, x, y, z, 1);
        vec4.transformMat4(heap, heap, inverseMatrix);
        vec3.set(out, heap[0] / heap[3], heap[1] / heap[3], heap[2] / heap[3]);
        
        return out;
    };
}());