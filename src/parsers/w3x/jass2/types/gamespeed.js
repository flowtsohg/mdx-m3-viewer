import JassHandle from './handle';

export default class JassGameSpeed extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 0: return 'MAP_SPEED_SLOWEST';
            case 1: return 'MAP_SPEED_SLOW';
            case 2: return 'MAP_SPEED_NORMAL';
            case 3: return 'MAP_SPEED_FAST';
            case 4: return 'MAP_SPEED_FASTEST';
        }
    }
};
