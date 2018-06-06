import JassAgent from './agent';

/**
 * type rect
 */
export default class JassRect extends JassAgent {
  /**
   * @param {JassContext} jassContext
   * @param {number} minx
   * @param {number} miny
   * @param {number} maxx
   * @param {number} maxy
   */
  constructor(jassContext, minx, miny, maxx, maxy) {
    super(jassContext);

    /** @member {Float32Array} */
    this.center = new Float32Array([maxx - minx, maxy - miny]);
    /** @member {Float32Array} */
    this.min = new Float32Array([minx, miny]);
    /** @member {Float32Array} */
    this.max = new Float32Array([maxx, maxy]);
  }
}
