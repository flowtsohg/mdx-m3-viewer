import JassAgent from './agent';

/**
 * type player
 */
export default class JassPlayer extends JassAgent {
  /**
   * @param {number} index
   * @param {number} maxPlayers
   */
  constructor(index, maxPlayers) {
    super();

    this.index = index;
    this.name = `Player ${index}`;
    this.team = -1;
    this.startLocation = -1;
    this.forcedStartLocation = -1;
    this.color = -1;
    this.racePreference = -1;
    this.raceSelectable = false;
    this.controller = -1;
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
}
