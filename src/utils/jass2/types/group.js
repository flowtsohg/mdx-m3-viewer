import JassAgent from './agent';

/**
 * type group
 */
export default class JassGroup extends JassAgent {
  /**
   * @param {JassContext} jass
   */
  constructor(jass) {
    super(jass);

    /** @member {Set<JassUnit>} */
    this.units = new Set();
  }
}
