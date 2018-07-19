import JassAgent from './agent';

/**
 * type player
 */
export default class JassPlayer extends JassAgent {
  /**
   * @param {JassContext} jass
   * @param {number} index
   * @param {number} maxPlayers
   */
  constructor(jass, index, maxPlayers) {
    super(jass);

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

    for (let i = 0; i < maxPlayers; i++) {
      if (i !== index) {
        this.alliances.set(i, {
          passive: false,
          helpRequest: false,
          helpResponse: false,
          sharedXp: false,
          sharedSpells: false,
          sharedVision: false,
          sharedControl: false,
          sharedAdvancedControl: false,
          rescuable: false,
          sharedVisionForced: false,
        });
      }
    }
  }

  /**
   * @return {string}
   */
  toString() {
    return `Player(${this.index})`;
  }
}
