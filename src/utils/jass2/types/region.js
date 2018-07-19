import JassAgent from './agent';

/**
 * type region
 */
export default class JassRegion extends JassAgent {
  /**
   * @param {JassContext} jass
   */
  constructor(jass) {
    super(jass);

    /** @member {Set<JassRect>} */
    this.rects = new Set();
  }
}
