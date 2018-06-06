import JassAgent from './agent';

/**
 * type widget
 */
export default class JassWidget extends JassAgent {
  /**
   * @param {JassContext} jassContext
   */
  constructor(jassContext) {
    super(jassContext);

    /** @member {number} */
    this.health = 0;
    /** @member {number} */
    this.maxHealth = 0;
  }
}
