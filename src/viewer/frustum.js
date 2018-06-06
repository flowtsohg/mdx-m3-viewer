import {vec3, vec4} from 'gl-matrix';

/**
 * Get the distance of a point from a plane.
 *
 * @param {vec4} plane
 * @param {vec3} point
 * @return {number}
 */
function distanceToPlane(plane, point) {
  // dot(plane, vec4(point, 1));
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
 * A frustum.
 */
export default class Frustum {
  /**
   *
   */
  constructor() {
    // Left, right, top, bottom, near, far
    this.planes = [vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create()];
  }

  /**
   * Test it a sphere with the given center and radius intersects this frustum.
   *
   * @param {vec3} center
   * @param {number} radius
   * @return {boolean}
   */
  testSphere(center, radius) {
    for (let plane of this.planes) {
      if (distanceToPlane(plane, center) <= -radius) {
        return false;
      }
    }

    return true;
  }
  /*
  testIntersectionAABB(boundingShape) {
      const TEST_INSIDE = 2,
          TEST_INTERSECT = 1,
          TEST_OUTSIDE = 0;

      let worldLocation = boundingShape.worldLocation,
          worldScale = boundingShape.worldScale,
          planes = this.planes,
          result = TEST_INSIDE,
          v = vec3.heap;

      for (let i = 0; i < 6; i++) {
          let plane = planes[i],
              a = plane[0],
              b = plane[1],
              c = plane[2],
              d = plane[3],
              v2 = [];

          // Positive vertex
          boundingShape.getPositiveVertex(v, plane);
          vec3.mulAndAdd(v2, v, worldScale, worldLocation);
          if ((a * v2[0] + b * v2[1] + c * v2[2] + d) < 0) {
              return TEST_OUTSIDE;
          }

          // Negative vertex
          boundingShape.getNegativeVertex(v, plane);
          vec3.mulAndAdd(v2, v, worldScale, worldLocation);
          if ((a * v2[0] + b * v2[1] + c * v2[2] + d) < 0) {
              result = TEST_INTERSECT;
          }

      }

      return result;
  }
  */

  /**
   * Recalculate the frustum planes according to the given matrix.
   *
   * @param {mat4} m
   */
  recalculatePlanes(m) {
    let a00 = m[0], a01 = m[4], a02 = m[8], a03 = m[12],
      a10 = m[1], a11 = m[5], a12 = m[9], a13 = m[13],
      a20 = m[2], a21 = m[6], a22 = m[10], a23 = m[14],
      a30 = m[3], a31 = m[7], a32 = m[11], a33 = m[15],
      planes = this.planes,
      plane;

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
}
