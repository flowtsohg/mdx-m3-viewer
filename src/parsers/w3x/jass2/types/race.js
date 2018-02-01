import JassHandle from './handle';

export default class JassRace extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 1: return 'RACE_HUMAN';
            case 2: return 'RACE_ORC';
            case 3: return 'RACE_UNDEAD';
            case 4: return 'RACE_NIGHTELF';
            case 5: return 'RACE_DEMON';
            case 7: return 'RACE_OTHER';
        }
    }
};
