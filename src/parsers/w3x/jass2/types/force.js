import JassAgent from './agent';

/**
 * type force
 */
export default class JassForce extends JassAgent {
  /**
   * @param {JassContext} jassContext
   */
  constructor(jassContext) {
    super(jassContext);

    /** @member {Set<JassPlayer>} */
    this.players = new Set();
  }
}
