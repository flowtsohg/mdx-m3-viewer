import JassAgent from './agent';

/**
 * type location
 */
export default class JassLocation extends JassAgent {
  /**
   * @param {JassContext} jassContext
   * @param {number} x
   * @param {number} y
   */
  constructor(jassContext, x, y) {
    super(jassContext);

    /** @member {number} */
    this.x = x;
    /** @member {number} */
    this.y = y;
    /** @member {number} */
    this.z = 0;
  }
}
