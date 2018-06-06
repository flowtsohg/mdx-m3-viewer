import {vec3, quat} from 'gl-matrix';
import {VEC3_ZERO, QUAT_ZERO} from './gl-matrix-addon';
import {lerp, hermite, bezier} from './math';

// Heap allocations needed for this module.
// NOTE: The values returned by interpolate() are not heap safe!
//       In other words, if you call interpolate() twice with the same input-types, you will get back the same typed array!
let vectorHeap = vec3.create();
let quatHeap = quat.create();

export default {
  scalar(a, b, c, d, t, type) {
    if (type === 0) {
      return a;
    } else if (type === 1) {
      return lerp(a, d, t);
    } else if (type === 2) {
      return hermite(a, b, c, d, t);
    } else if (type === 3) {
      return bezier(a, b, c, d, t);
    }

    return 0;
  },

  vector(a, b, c, d, t, type) {
    if (type === 0) {
      return a;
    } else if (type === 1) {
      return vec3.lerp(vectorHeap, a, d, t);
    } else if (type === 2) {
      return vec3.hermite(vectorHeap, a, b, c, d, t);
    } else if (type === 3) {
      return vec3.bezier(vectorHeap, a, b, c, d, t);
    }

    return vec3.copy(vectorHeap, VEC3_ZERO);
  },

  quaternion(a, b, c, d, t, type) {
    if (type === 0) {
      return a;
    } else if (type === 1) {
      return quat.slerp(quatHeap, a, d, t);
    } else if (type === 2 || type === 3) {
      return quat.sqlerp(quatHeap, a, b, c, d, t);
    }

    return quat.copy(quatHeap, QUAT_ZERO);
  },

  interpolate(a, b, c, d, t, type) {
    const length = a.length;

    if (length === 3) {
      return this.vector(a, b, c, d, t, type);
    } else if (length === 4) {
      return this.quaternion(a, b, c, d, t, type);
    } else {
      return this.scalar(a, b, c, d, t, type);
    }
  },
};
