/**
 * Returns an array that only contains unique values found in the source array.
 *
 * @param {Float32Array} min
 * @param {Float32Array} max
 * @return {Object}
 */
export function extentToSphere(min, max) {
  let minx = min[0];
  let miny = min[1];
  let minz = min[2];
  let maxx = max[0];
  let maxy = max[1];
  let maxz = max[2];
  let dx = maxx - minx;
  let dy = maxy - miny;
  let dz = maxz - minz;

  return {
    center: new Float32Array([(minx + maxx) / 2, (miny + maxy) / 2, (minz + maxz) / 2]),
    radius: Math.sqrt(dx * dx + dy * dy + dz * dz) / 2,
  };
}
