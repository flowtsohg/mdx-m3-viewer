import JassWidget from './widget';
import JassLocation from './location';

export default class JassUnit extends JassWidget {
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
        this.mana = parseFloat(balanceRow.realM) || 0;
        this.acquireRange = 500;
	}

    toString() {
        return `unit(${this.player}, ${this.balanceRow.unitBalanceID})`;
    }
};
