import {base256ToString} from '../../../common/typecast';
import JassWidget from './widget';

/**
 * type unit
 */
export default class JassUnit extends JassWidget {
  /**
   * @param {JassPlayer} player
   * @param {string} unitId
   * @param {number} x
   * @param {number} y
   * @param {number} face
   */
  constructor(player, unitId, x, y, face) {
    super();


    this.player = player;
    this.unitId = base256ToString(unitId);
    this.x = x;
    this.y = y;
    this.face = face;
    this.acquireRange = 500;

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
