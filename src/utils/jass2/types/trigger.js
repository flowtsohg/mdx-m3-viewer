import JassAgent from './agent';

/**
 * type trigger
 */
export default class JassTrigger extends JassAgent {
  /**
   * @param {JassContext} jass
   */
  constructor(jass) {
    super(jass);

    /** @member {boolean} */
    this.enabled = true;
  }
}
