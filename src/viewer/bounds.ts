/**
 * An object representing both a sphere and an AABB, which is used for culling of all instances.
 * 
 * By default, the size of the bounds is 0, and thus point-culling is done.
 */
export default class Bounds {
  x: number;
  y: number;
  r: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.r = 0;
  }

  fromExtents(min: Float32Array, max: Float32Array) {
    let w = max[0] - min[0];
    let h = max[1] - min[1];

    this.x = w / 2;
    this.y = h / 2;
    this.r = Math.max(w, h) / 2;
  }
}
