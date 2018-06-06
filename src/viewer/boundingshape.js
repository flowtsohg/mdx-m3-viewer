import {SceneNode} from './node';

/**
 * A bounding shape.
 */
export default class BoundingShape extends SceneNode {
  /**
   *
   */
  constructor() {
    super();

    this.min = new Float32Array([-1, -1, -1]);
    this.max = new Float32Array([1, 1, 1]);
    this.radius = Math.sqrt(2);
  }

  /**
   * @param {*} min
   * @param {*} max
   */
  fromBounds(min, max) {
    this.min.set(min);
    this.max.set(max);

    let dX = max[0] - min[0];
    let dY = max[1] - min[1];
    let dZ = max[2] - min[2];

    this.radius = Math.sqrt(dX * dX + dY * dY + dZ * dZ) / 2;
  }

  /**
   *
   * @param {number} r
   */
  fromRadius(r) {
    let s = r * Math.cos(r);
    let min = this.min;
    let max = this.max;

    min[0] = min[1] = min[2] = s;
    max[0] = max[1] = max[2] = -s;

    this.radius = r;
  }

  /**
   *
   * @param {*} vertices
   */
  fromVertices(vertices) {
    let min = [1E9, 1E9, 1E9];
    let max = [-1E9, -1E9, -1E9];

    for (let i = 0, l = vertices.length; i < l; i += 3) {
      let x = vertices[i];
      let y = vertices[i + 1];
      let z = vertices[i + 2];

      if (x > max[0]) {
        max[0] = x;
      }

      if (x < min[0]) {
        min[0] = x;
      }

      if (y > max[1]) {
        max[1] = y;
      }

      if (y < min[1]) {
        min[1] = y;
      }

      if (z > max[2]) {
        max[2] = z;
      }

      if (z < min[2]) {
        min[2] = z;
      }
    }

    // this.fromRadius();

    this.fromBounds(min, max);
  }

  /**
   *
   * @param {vec3} out
   * @param {vec3} normal
   * @return {vec3}
   */
  getPositiveVertex(out, normal) {
    let min = this.min;
    let max = this.max;

    if (normal[0] >= 0) {
      out[0] = max[0];
    } else {
      out[0] = min[0];
    }

    if (normal[1] >= 0) {
      out[1] = max[1];
    } else {
      out[1] = min[1];
    }

    if (normal[2] >= 0) {
      out[2] = max[2];
    } else {
      out[2] = min[2];
    }

    return out;
    // return vec3.mulAndAdd(out, out, this.worldScale, this.worldLocation);
  }

  /**
   *
   * @param {vec3} out
   * @param {vec3} normal
   * @return {vec3}
   */
  getNegativeVertex(out, normal) {
    let min = this.min;
    let max = this.max;

    if (normal[0] >= 0) {
      out[0] = min[0];
    } else {
      out[0] = max[0];
    }

    if (normal[1] >= 0) {
      out[1] = min[1];
    } else {
      out[1] = max[1];
    }

    if (normal[2] >= 0) {
      out[2] = min[2];
    } else {
      out[2] = max[2];
    }

    return out;
    // return vec3.mulAndAdd(out, out, this.worldScale, this.worldLocation);
  }
}
