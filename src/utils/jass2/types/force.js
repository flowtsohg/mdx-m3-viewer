import JassAgent from './agent';

/**
 * type force
 */
export default class JassForce extends JassAgent {
  /**
   * @param {JassContext} jass
   */
  constructor(jass) {
    super(jass);

    /** @member {Set<JassPlayer>} */
    this.players = new Set();
  }
}
