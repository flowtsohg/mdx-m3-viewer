import JassAgent from './agent';

/**
 * type player
 */
export default class JassPlayer extends JassAgent {
  index: number;
  name: string;
  team = -1;
  startLocation = -1;
  forcedStartLocation = -1;
  color = -1;
  racePreference = -1;
  raceSelectable = false;
  controller = -1;
  alliances: Map<number, object> = new Map();

  constructor(index: number, maxPlayers: number) {
    super();

    this.index = index;
    this.name = `Player ${index}`;

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
