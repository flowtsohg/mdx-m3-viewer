import JassAgent from './agent';

/**
 * type region
 */
export default class JassRegion extends JassAgent {
  /**
   * @param {JassContext} jassContext
   */
  constructor(jassContext) {
    super(jassContext);

    /** @member {Set<JassRect>} */
    this.rects = new Set();
  }
}
