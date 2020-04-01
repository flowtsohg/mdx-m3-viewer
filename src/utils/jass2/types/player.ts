import JassAgent from './agent';

/**
 * type player
 */
export default class JassPlayer extends JassAgent {
  index: number;
  name: string;
  team: number = -1;
  startLocation: number = -1;
  forcedStartLocation: number = -1;
  color: number = -1;
  racePreference: number = -1;
  raceSelectable: boolean = false;
  controller: number = -1;
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
