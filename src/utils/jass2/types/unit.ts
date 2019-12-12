import { base256ToString } from '../../../common/typecast';
import JassWidget from './widget';
import JassPlayer from './player';

/**
 * type unit
 */
export default class JassUnit extends JassWidget {
  player: JassPlayer;
  unitId: string;
  x: number;
  y: number;
  face: number;
  acquireRange: number = 500;

  constructor(player: JassPlayer, unitId: number, x: number, y: number, face: number) {
    super();

    this.player = player;
    this.unitId = base256ToString(unitId);
    this.x = x;
    this.y = y;
    this.face = face;

    // if (balanceRow) {
    //   this.balanceRow = balanceRow;
    //   this.health = balanceRow.realHP;
    //   this.maxHealth = this.health;
    //   this.mana = parseFloat(balanceRow.realM) || 0;
    //   this.maxMana = this.mana;
    // } else if (jass.debugMode) {
    //   console.log('Unknown unitid', unitId);
    // }
  }
}
