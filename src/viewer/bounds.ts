/**
 * An object representing both a sphere and an AABB, which is used for culling of all instances.
 * 
 * By default, the size of the bounds is 0, and thus point-culling is done.
 */
export default class Bounds {
  x: number = 0;
  y: number = 0;
  z: number = 0;
  r: number = 0;

  fromExtents(min: Float32Array, max: Float32Array) {
    let x = min[0];
    let y = min[1];
    let z = min[2];
    let w = max[0] - x;
    let d = max[1] - y;
    let h = max[2] - z;

    this.x = x + w / 2;
    this.y = y + d / 2;
    this.z = z + h / 2;
    this.r = Math.max(w, d, h) / 2;
  }
}
