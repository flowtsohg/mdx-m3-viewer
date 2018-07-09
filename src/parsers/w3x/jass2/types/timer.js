import JassAgent from './agent';

/**
 * type timer
 */
export default class JassTimer extends JassAgent {
  /**
   * @param {JassContext} jass
   */
  constructor(jass) {
    super(jass);

    /** @member {number} */
    this.elapsed = 0;
    /** @member {number} */
    this.timeout = 0;
    /** @member {boolean} */
    this.periodic = false;
    /** @member {function|null} */
    this.handlerFunc = null;
  }
}
