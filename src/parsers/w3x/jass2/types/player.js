import JassAgent from './agent';

/**
 * type player
 */
export default class JassPlayer extends JassAgent {
  /**
   * @param {JassContext} jassContext
   * @param {number} index
   */
  constructor(jassContext, index) {
    super(jassContext);

    this.index = index;
    this.name = `Player ${index}`;
    this.team = -1;
    this.startLocation = -1;
    this.forcedStartLocation = -1;
    this.color = null;
    this.racePreference = null;
    this.raceSelectable = false;
    this.controller = null;
    this.alliances = new Map();
  }

  /**
   * @return {string}
   */
  toString() {
    return `Player(${this.index})`;
  }
}
