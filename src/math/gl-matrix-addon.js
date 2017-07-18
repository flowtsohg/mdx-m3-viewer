import glMatrix from 'gl-matrix';

glMatrix.vec2.heap = glMatrix.vec2.create();

glMatrix.vec3.UNIT_X = glMatrix.vec3.fromValues(1, 0, 0);
glMatrix.vec3.UNIT_Y = glMatrix.vec3.fromValues(0, 1, 0);
glMatrix.vec3.UNIT_Z = glMatrix.vec3.fromValues(0, 0, 1);

glMatrix.vec3.heap = glMatrix.vec3.create();
glMatrix.vec3.heap2 = glMatrix.vec3.create();
glMatrix.vec3.heap3 = glMatrix.vec3.create();
glMatrix.vec3.heap4 = glMatrix.vec3.create();

glMatrix.vec3.ZERO = glMatrix.vec3.create();
glMatrix.vec3.ONE = glMatrix.vec3.fromValues(1, 1, 1);

glMatrix.quat.ZERO = glMatrix.quat.fromValues(0, 0, 0, 0);
glMatrix.quat.DEFAULT = glMatrix.quat.create();
glMatrix.quat.heap = glMatrix.quat.create();

glMatrix.mat3.heap = glMatrix.mat3.create();

glMatrix.mat4.heap = glMatrix.mat4.create();

glMatrix.vec3.unproject = (function () {
    const heap = glMatrix.vec4.create();
    
    return function (out, v, inverseMatrix, viewport) {
        const x = 2 * (v[0] - viewport[0]) / viewport[2] - 1,
            y = 1 - 2 * (v[1] - viewport[1]) / viewport[3],
            z = 2 * v[2] - 1;
        
        glMatrix.vec4.set(heap, x, y, z, 1);
        glMatrix.vec4.transformMat4(heap, heap, inverseMatrix);
        glMatrix.vec3.set(out, heap[0] / heap[3], heap[1] / heap[3], heap[2] / heap[3]);
        
        return out;
    };
}());

glMatrix.quat.nlerp = function (out, a, b, t) {
    const dot = glMatrix.quat.dot(a, b),
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

    glMatrix.quat.normalize(out, out);

    return out;
};

glMatrix.quat.nquad = (function () {
    const temp1 = glMatrix.quat.create(),
        temp2 = glMatrix.quat.create();
  
    return function (out, a, b, c, d, t) {
        glMatrix.quat.nlerp(temp1, a, d, t);
        glMatrix.quat.nlerp(temp2, b, c, t);
        glMatrix.quat.nlerp(out, temp1, temp2, 2 * t * (1 - t));

        return out;
    };
}());

export default glMatrix;
