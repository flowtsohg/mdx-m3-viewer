import JassAgent from './agent';

/**
 * type force
 */
export default class JassForce extends JassAgent {
  /**
   *
   */
  constructor() {
    super();

    /** @member {Set<JassPlayer>} */
    this.players = new Set();
  }
}
