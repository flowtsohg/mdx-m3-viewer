import JassHandle from './handle';

export default class JassVersion extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'VERSION_REIGN_OF_CHAOS';
            case 1: return 'VERSION_FROZEN_THRONE';
        }
    }
};
