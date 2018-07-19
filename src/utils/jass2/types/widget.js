import JassAgent from './agent';

/**
 * type widget
 */
export default class JassWidget extends JassAgent {
  /**
   * @param {JassContext} jass
   */
  constructor(jass) {
    super(jass);

    /** @member {number} */
    this.health = 0;
    /** @member {number} */
    this.maxHealth = 0;
  }
}
