import {vec3, quat} from 'gl-matrix';
import {lerp, hermite, bezier} from './math';

/**
 * @param {ArrayBufferView} out
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @param {number} t
 * @param {number} type
 * @return {out}
 */
export function interpolateScalar(out, a, b, c, d, t, type) {
  if (type === 0) {
    out[0] = a[0];
  } else if (type === 1) {
    out[0] = lerp(a[0], d[0], t);
  } else if (type === 2) {
    out[0] = hermite(a[0], b[0], c[0], d[0], t);
  } else if (type === 3) {
    out[0] = bezier(a[0], b[0], c[0], d[0], t);
  }

  return out;
}

/**
 * @param {vec3} out
 * @param {vec3} a
 * @param {vec3} b
 * @param {vec3} c
 * @param {vec3} d
 * @param {number} t
 * @param {number} type
 * @return {out}
 */
export function interpolateVector(out, a, b, c, d, t, type) {
  if (type === 0) {
    vec3.copy(out, a);
  } else if (type === 1) {
    vec3.lerp(out, a, d, t);
  } else if (type === 2) {
    vec3.hermite(out, a, b, c, d, t);
  } else if (type === 3) {
    vec3.bezier(out, a, b, c, d, t);
  }

  return out;
}

/**
 * @param {quat} out
 * @param {quat} a
 * @param {quat} b
 * @param {quat} c
 * @param {quat} d
 * @param {number} t
 * @param {number} type
 * @return {out}
 */
export function interpolateQuaternion(out, a, b, c, d, t, type) {
  if (type === 0) {
    quat.copy(out, a);
  } else if (type === 1) {
    quat.slerp(out, a, d, t);
  } else if (type === 2 || type === 3) {
    quat.sqlerp(out, a, b, c, d, t);
  }

  return out;
}
