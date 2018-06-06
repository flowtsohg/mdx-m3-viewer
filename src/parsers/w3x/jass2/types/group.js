import JassAgent from './agent';

/**
 * type group
 */
export default class JassGroup extends JassAgent {
  /**
   * @param {JassContext} jassContext
   */
  constructor(jassContext) {
    super(jassContext);

    /** @member {Set<JassUnit>} */
    this.units = new Set();
  }
}
