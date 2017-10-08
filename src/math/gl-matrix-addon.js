import { vec2, vec3, vec4, quat, mat3, mat4 } from 'gl-matrix';

vec3.UNIT_X = vec3.fromValues(1, 0, 0);
vec3.UNIT_Y = vec3.fromValues(0, 1, 0);
vec3.UNIT_Z = vec3.fromValues(0, 0, 1);

vec3.ZERO = vec3.create();
vec3.ONE = vec3.fromValues(1, 1, 1);

quat.ZERO = quat.fromValues(0, 0, 0, 0);
quat.DEFAULT = quat.create();

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
    let ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3],
        inverseFactor = 1 - t,
        x1 = inverseFactor * ax,
        y1 = inverseFactor * ay,
        z1 = inverseFactor * az,
        w1 = inverseFactor * aw,
        x2 = t * bx,
        y2 = t * by,
        z2 = t * bz,
        w2 = t * bw;

    // Dot product
    if (ax * bx + ay * by + az * bz + aw * bw < 0) {
        out[0] = x1 - x2;
        out[1] = y1 - y2;
        out[2] = z1 - z2;
        out[3] = w1 - w2;
    } else {
        out[0] = x1 + x2;
        out[1] = y1 + y2;
        out[2] = z1 + z2;
        out[3] = w1 + w2;
    }

    // Super slow and generally not needed.
    //quat.normalize(out, out);

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
