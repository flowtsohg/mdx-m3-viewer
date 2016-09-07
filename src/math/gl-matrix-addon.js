vec2.heap = vec2.create();

vec3.UNIT_X = vec3.fromValues(1, 0, 0);
vec3.UNIT_Y = vec3.fromValues(0, 1, 0);
vec3.UNIT_Z = vec3.fromValues(0, 0, 1);

vec3.heap = vec3.create();
vec3.heap2 = vec3.create();
vec3.heap3 = vec3.create();

vec3.ZERO = vec3.create();
vec3.ONE = vec3.fromValues(1, 1, 1);

quat.ZERO = quat.fromValues(0, 0, 0, 0);
quat.DEFAULT = quat.create();

mat4.heap = mat4.create();

mat4.toRotationMat4 = (function () {
    const quadrent = mat3.create();
    
    return function (out, m) {
        mat3.fromMat4(quadrent, m);
        mat3.invert(quadrent, quadrent);
        
        out[0] = quadrent[0];
        out[1] = quadrent[1];
        out[2] = quadrent[2];
        out[3] = 0;
        out[4] = quadrent[3];
        out[5] = quadrent[4];
        out[6] = quadrent[5];
        out[7] = 0;
        out[8] = quadrent[6];
        out[9] = quadrent[7];
        out[10] = quadrent[8];
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        
        return out;
    };
}());

mat4.decomposeScale = function (out, m) {
    const m0 = m[0], m1 = m[1], m2 = m[2],
        m4 = m[4], m5 = m[5], m6 = m[6],
        m8 = m[8], m9 = m[9], m10 = m[10];
    
    out[0] = Math.sqrt(m0*m0 + m1*m1 + m2*m2);
    out[1] = Math.sqrt(m4*m4 + m5*m5 + m6*m6);
    out[2] = Math.sqrt(m8*m8 + m9*m9 + m10*m10);
    
    return out;
};

vec3.unproject = (function () {
    const heap = vec4.create();
    
    return function (out, v, inverseMatrix, viewport) {
        const x = 2 * (v[0] - viewport[0]) / viewport[2] - 1,
            y = 1 - 2 * (v[1] - viewport[1]) / viewport[3],
            z = 2 * v[2] - 1;
        
        vec4.set(heap, x, y, z, 1);
        vec4.transformMat4(heap, heap, inverseMatrix);
        vec3.set(out, heap[0] / heap[3], heap[1] / heap[3], heap[2] / heap[3]);
        
        return out;
    };
}());

quat.nlerp = function (out, a, b, t) {
    const dot = quat.dot(a, b),
        inverseFactor = 1 - t;

    if (dot < 0) {
        out[0] = inverseFactor * a[0] - t * b[0];
        out[1] = inverseFactor * a[1] - t * b[1];
        out[2] = inverseFactor * a[2] - t * b[2];
        out[3] = inverseFactor * a[3] - t * b[3];
    } else {
        out[0] = inverseFactor * a[0] + t * b[0];
        out[1] = inverseFactor * a[1] + t * b[1];
        out[2] = inverseFactor * a[2] + t * b[2];
        out[3] = inverseFactor * a[3] + t * b[3];
    }

    quat.normalize(out, out);

    return out;
};

quat.nquad = (function () {
    const temp1 = quat.create(),
        temp2 = quat.create();
  
    return function (out, a, b, c, d, t) {
        quat.nlerp(temp1, a, d, t);
        quat.nlerp(temp2, b, c, t);
        quat.nlerp(out, temp1, temp2, 2 * t * (1 - t));

        return out;
    };
}());


const plane = {};

plane.create = quat.create;

plane.normalize = function (out, p) {
    const l = 1 / vec3.length(p);

    out[0] = p[0] * l;
    out[1] = p[1] * l;
    out[2] = p[2] * l;
    out[3] = p[3] * l;

    return out;
};

plane.fromMat4 = function (out, a) {
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Left clipping plane
    out[0][0] = a30 + a00;
    out[0][1] = a31 + a01;
    out[0][2] = a32 + a02;
    out[0][3] = a33 + a03;

    // Right clipping plane
    out[1][0] = a30 - a00;
    out[1][1] = a31 - a01;
    out[1][2] = a32 - a02;
    out[1][3] = a33 - a03;

    // Top clipping plane
    out[2][0] = a30 - a10;
    out[2][1] = a31 - a11;
    out[2][2] = a32 - a12;
    out[2][3] = a33 - a13;

    // Bottom clipping plane
    out[3][0] = a30 + a10;
    out[3][1] = a31 + a11;
    out[3][2] = a32 + a12;
    out[3][3] = a33 + a13;

    // Near clipping plane
    out[4][0] = a30 + a20;
    out[4][1] = a31 + a21;
    out[4][2] = a32 + a22;
    out[4][3] = a33 + a23;

    // Far clipping plane
    out[5][0] = a30 - a20;
    out[5][1] = a31 - a21;
    out[5][2] = a32 - a22;
    out[5][3] = a33 - a23;

    plane.normalize(out[0], out[0]);
    plane.normalize(out[1], out[1]);
    plane.normalize(out[2], out[2]);
    plane.normalize(out[3], out[3]);
    plane.normalize(out[4], out[4]);
    plane.normalize(out[5], out[5]);

    return out;
};

plane.distanceToPoint = function (p, v) {
    return p[0] * v[0] + p[1] * v[1] + p[2] * v[2] + p[3];
};
