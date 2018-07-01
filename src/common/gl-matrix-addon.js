import {vec3, vec4, quat} from 'gl-matrix';

let VEC3_UNIT_X = vec3.fromValues(1, 0, 0);
let VEC3_UNIT_Y = vec3.fromValues(0, 1, 0);
let VEC3_UNIT_Z = vec3.fromValues(0, 0, 1);
let VEC3_ZERO = vec3.create();
let VEC3_ONE = vec3.fromValues(1, 1, 1);
let QUAT_ZERO = quat.fromValues(0, 0, 0, 0);
let QUAT_DEFAULT = quat.create();

let heap = vec4.create();

/**
 * @param {vec3} out
 * @param {vec3} v
 * @param {mat4} inverseMatrix
 * @param {vec4} viewport
 * @return {vec3}
 */
function unproject(out, v, inverseMatrix, viewport) {
  let x = 2 * (v[0] - viewport[0]) / viewport[2] - 1;
  let y = 1 - 2 * (v[1] - viewport[1]) / viewport[3];
  let z = 2 * v[2] - 1;

  vec4.set(heap, x, y, z, 1);
  vec4.transformMat4(heap, heap, inverseMatrix);
  vec3.set(out, heap[0] / heap[3], heap[1] / heap[3], heap[2] / heap[3]);

  return out;
}

/**
 * Get the distance of a point from a plane.
 * dot(plane, vec4(point, 1))
 *
 * @param {vec4} plane
 * @param {vec3} point
 * @return {number}
 */
function distanceToPlane(plane, point) {
  return plane[0] * point[0] + plane[1] * point[1] + plane[2] * point[2] + plane[3];
}

/**
 * Normalize a plane. Note that this is not the same as normalizing a vec4.
 *
 * @param {vec4} out
 * @param {vec4} plane
 */
function normalizePlane(out, plane) {
  let len = vec3.len(plane);

  out[0] = plane[0] / len;
  out[1] = plane[1] / len;
  out[2] = plane[2] / len;
  out[3] = plane[3] / len;
}

/**
 * Unpacks a matrix's planes.
 *
 * @param {Array<vec4>} planes
 * @param {mat4} m
 */
function unpackPlanes(planes, m) {
  // eslint-disable-next-line one-var
  let a00 = m[0], a01 = m[4], a02 = m[8], a03 = m[12],
    a10 = m[1], a11 = m[5], a12 = m[9], a13 = m[13],
    a20 = m[2], a21 = m[6], a22 = m[10], a23 = m[14],
    a30 = m[3], a31 = m[7], a32 = m[11], a33 = m[15];
  let plane;

  // Left clipping plane
  plane = planes[0];
  plane[0] = a30 + a00;
  plane[1] = a31 + a01;
  plane[2] = a32 + a02;
  plane[3] = a33 + a03;

  // Right clipping plane
  plane = planes[1];
  plane[0] = a30 - a00;
  plane[1] = a31 - a01;
  plane[2] = a32 - a02;
  plane[3] = a33 - a03;

  // Top clipping plane
  plane = planes[2];
  plane[0] = a30 - a10;
  plane[1] = a31 - a11;
  plane[2] = a32 - a12;
  plane[3] = a33 - a13;

  // Bottom clipping plane
  plane = planes[3];
  plane[0] = a30 + a10;
  plane[1] = a31 + a11;
  plane[2] = a32 + a12;
  plane[3] = a33 + a13;

  // Near clipping plane
  plane = planes[4];
  plane[0] = a30 + a20;
  plane[1] = a31 + a21;
  plane[2] = a32 + a22;
  plane[3] = a33 + a23;

  // Far clipping plane
  plane = planes[5];
  plane[0] = a30 - a20;
  plane[1] = a31 - a21;
  plane[2] = a32 - a22;
  plane[3] = a33 - a23;

  normalizePlane(planes[0], planes[0]);
  normalizePlane(planes[1], planes[1]);
  normalizePlane(planes[2], planes[2]);
  normalizePlane(planes[3], planes[3]);
  normalizePlane(planes[4], planes[4]);
  normalizePlane(planes[5], planes[5]);
}

let vec3Heap = vec3.create();

/**
 * @param {quat} q
 * @return {number}
 */
function getRotationX(q) {
  vec3.transformQuat(vec3Heap, VEC3_UNIT_Y, q);

  return Math.atan2(vec3Heap[2], vec3Heap[1]);
}

/**
 * @param {quat} q
 * @return {number}
 */
function getRotationY(q) {
  vec3.transformQuat(vec3Heap, VEC3_UNIT_Z, q);

  return Math.atan2(vec3Heap[0], vec3Heap[2]);
}

/**
 * @param {quat} q
 * @return {number}
 */
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
  QUAT_ZERO,
  QUAT_DEFAULT,
  unproject,
  distanceToPlane,
  normalizePlane,
  unpackPlanes,
  getRotationX,
  getRotationY,
  getRotationZ,
};
