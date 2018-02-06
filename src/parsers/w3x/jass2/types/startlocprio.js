import JassHandle from './handle';

export default class JassStartLocPrio extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'MAP_LOC_PRIO_LOW';
            case 1: return 'MAP_LOC_PRIO_HIGH';
            case 2: return 'MAP_LOC_PRIO_NOT';
        }
    }
};
