vec2.heap = vec2.create();

vec3.UNIT_X = vec3.fromValues(1, 0, 0);
vec3.UNIT_Y = vec3.fromValues(0, 1, 0);
vec3.UNIT_Z = vec3.fromValues(0, 0, 1);

vec3.heap = vec3.create();
vec3.heap2 = vec3.create();
vec3.heap3 = vec3.create();
vec3.heap4 = vec3.create();

vec3.ZERO = vec3.create();
vec3.ONE = vec3.fromValues(1, 1, 1);

quat.ZERO = quat.fromValues(0, 0, 0, 0);
quat.DEFAULT = quat.create();
quat.heap = quat.create();

mat3.heap = mat3.create();

mat4.heap = mat4.create();

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
