import { vec2, vec3, vec4, quat, mat3, mat4 } from 'gl-matrix';

let VEC3_UNIT_X = vec3.fromValues(1, 0, 0),
    VEC3_UNIT_Y = vec3.fromValues(0, 1, 0),
    VEC3_UNIT_Z = vec3.fromValues(0, 0, 1),
    VEC3_ZERO = vec3.create(),
    VEC3_ONE = vec3.fromValues(1, 1, 1),
    QIAT_ZERO = quat.fromValues(0, 0, 0, 0),
    QUAT_DEFAULT = quat.create();

let heap = vec4.create();

function unproject(out, v, inverseMatrix, viewport) {
    let x = 2 * (v[0] - viewport[0]) / viewport[2] - 1,
        y = 1 - 2 * (v[1] - viewport[1]) / viewport[3],
        z = 2 * v[2] - 1;

    vec4.set(heap, x, y, z, 1);
    vec4.transformMat4(heap, heap, inverseMatrix);
    vec3.set(out, heap[0] / heap[3], heap[1] / heap[3], heap[2] / heap[3]);

    return out;
}

let vec3Heap = vec3.create();

function getRotationX(q) {
    vec3.transformQuat(vec3Heap, VEC3_UNIT_Y, q);

    return Math.atan2(vec3Heap[2], vec3Heap[1]);
}

function getRotationY(q) {
    vec3.transformQuat(vec3Heap, VEC3_UNIT_Z, q);
    
    return Math.atan2(vec3Heap[0], vec3Heap[2]);
}

function getRotationZ(q) {
    vec3.transformQuat(vec3Heap, VEC3_UNIT_X, q);

    return Math.atan2(vec3Heap[1], vec3Heap[0]);
}

export {
    VEC3_UNIT_X,
    VEC3_UNIT_Y,
    VEC3_UNIT_Z,
    VEC3_ZERO,
    VEC3_ONE,
    QIAT_ZERO,
    QUAT_DEFAULT,
    unproject,
    getRotationX,
    getRotationY,
    getRotationZ
};
