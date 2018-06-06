import JassWidget from './widget';
import JassLocation from './location';

/**
 * type unit
 */
export default class JassUnit extends JassWidget {
  /**
   * @param {JassContext} jassContext
   * @param {JassPlayer} player
   * @param {string} unitId
   * @param {number} x
   * @param {number} y
   * @param {number} face
   */
  constructor(jassContext, player, unitId, x, y, face) {
    super(jassContext);

    let balanceRow = jassContext.tables.UnitBalance.getRowByKey(unitId);

    if (!balanceRow) {
      console.log('Unknown unitid', unitId);
      return;
    }

    // Metadata
    this.balanceRow = balanceRow;

    this.player = player;
    this.location = new JassLocation(jassContext, x, y);
    this.face = face;
    this.health = balanceRow.realHP;
    this.maxHealth = this.health;
    this.mana = parseFloat(balanceRow.realM) || 0;
    this.maxMana = this.mana;
    this.acquireRange = 500;
  }
}
