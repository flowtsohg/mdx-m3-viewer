import JassAgent from './agent';

/**
 * type widget
 */
export default class JassWidget extends JassAgent {
  health: number;
  maxHealth: number;

  constructor() {
    super();

    this.health = 0;
    this.maxHealth = 0;
  }
}
