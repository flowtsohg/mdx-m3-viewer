import JassHandle from './handle';

export default class JassUnitState extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'UNIT_STATE_LIFE';
            case 1: return 'UNIT_STATE_MAX_LIFE';
            case 2: return 'UNIT_STATE_MANA';
            case 3: return 'UNIT_STATE_MAX_MANA';
        }
    }
};
