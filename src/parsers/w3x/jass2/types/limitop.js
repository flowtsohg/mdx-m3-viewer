import JassEventId from './eventid';

export default class JassLimitOp extends JassEventId {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'LESS_THAN';
            case 1: return 'LESS_THAN_OR_EQUAL';
            case 2: return 'EQUAL';
            case 3: return 'GREATER_THAN_OR_EQUAL';
            case 4: return 'GREATER_THAN';
            case 5: return 'NOT_EQUAL';
        }
    }
};
