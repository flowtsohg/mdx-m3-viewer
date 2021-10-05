/**
 * An object representing both a sphere and an AABB, which is used for culling of all instances.
 * 
 * By default, the size of the bounds is 0, and thus point-culling is done.
 */
export default class Bounds {
  x = 0;
  y = 0;
  z = 0;
  r = 0;

  fromExtents(min: Float32Array, max: Float32Array): void {
    const x = min[0];
    const y = min[1];
    const z = min[2];
    const w = max[0] - x;
    const d = max[1] - y;
    const h = max[2] - z;

    this.x = x + w / 2;
    this.y = y + d / 2;
    this.z = z + h / 2;

    // Ensure the radius is actually 0 or bigger.
    // Some models apparently have reversed extents, go figure.
    this.r = Math.max(0, Math.max(w, d, h) / 2);
  }
}
