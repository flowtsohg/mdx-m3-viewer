import JassAgent from './agent';

/**
 * type timer
 */
export default class JassTimer extends JassAgent {
  /**
   * @param {JassContext} jassContext
   */
  constructor(jassContext) {
    super(jassContext);

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
