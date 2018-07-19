import JassWidget from './widget';
import JassLocation from './location';

/**
 * type unit
 */
export default class JassUnit extends JassWidget {
  /**
   * @param {JassContext} jass
   * @param {JassPlayer} player
   * @param {string} unitId
   * @param {number} x
   * @param {number} y
   * @param {number} face
   */
  constructor(jass, player, unitId, x, y, face) {
    super(jass);

    let balanceRow = jass.mappedData.getRow(unitId);

    this.id = unitId;
    this.player = player;
    this.location = new JassLocation(jass, x, y);
    this.face = face;
    this.acquireRange = 500;

    if (balanceRow) {
      this.balanceRow = balanceRow;
      this.health = balanceRow.realHP;
      this.maxHealth = this.health;
      this.mana = parseFloat(balanceRow.realM) || 0;
      this.maxMana = this.mana;
    } else if (jass.debugMode) {
      console.log('Unknown unitid', unitId);
    }
  }
}
