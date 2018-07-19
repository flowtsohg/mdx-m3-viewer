import JassAgent from './agent';

/**
 * type location
 */
export default class JassLocation extends JassAgent {
  /**
   * @param {JassContext} jass
   * @param {number} x
   * @param {number} y
   */
  constructor(jass, x, y) {
    super(jass);

    /** @member {number} */
    this.x = x;
    /** @member {number} */
    this.y = y;
    /** @member {number} */
    this.z = 0;
  }
}
