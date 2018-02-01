import JassHandle from './handle';

export default class JassMapControl extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 0: return 'MAP_CONTROL_USER';
            case 1: return 'MAP_CONTROL_COMPUTER';
            case 2: return 'MAP_CONTROL_RESCUABLE';
            case 3: return 'MAP_CONTROL_NEUTRAL';
            case 4: return 'MAP_CONTROL_CREEP';
            case 5: return 'MAP_CONTROL_NONE';
        }
    }
};
