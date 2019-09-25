/**
 *
 */
export default class Bounds {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.x = 0;
    /** @member {number} */
    this.y = 0;
    /** @member {number} */
    this.r = 0;
  }

  /**
   * @param {Array<number>|Float32Array} min
   * @param {Array<number>|Float32Array} max
   */
  fromExtents(min, max) {
    let w = max[0] - min[0];
    let h = max[1] - min[1];

    this.x = w / 2;
    this.y = h / 2;
    this.r = Math.max(w, h) / 2;
  }
}
