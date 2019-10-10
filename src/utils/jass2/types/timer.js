import JassAgent from './agent';

/**
 * type timer
 */
export default class JassTimer extends JassAgent {
  /**
   *
   */
  constructor() {
    super();

    /** @member {number} */
    this.elapsed = 0;
    /** @member {number} */
    this.timeout = 0;
    /** @member {boolean} */
    this.periodic = false;
    /** @member {number} */
    this.handlerFunc = -1;
  }
}
