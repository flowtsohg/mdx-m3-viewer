import JassHandle from './handle';

export default class JassRacePreference extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 1: return 'RACE_PREF_HUMAN';
            case 2: return 'RACE_PREF_ORC';
            case 4: return 'RACE_PREF_NIGHTELF';
            case 8: return 'RACE_PREF_UNDEAD';
            case 16: return 'RACE_PREF_DEMON';
            case 32: return 'RACE_PREF_RANDOM';
            case 64: return 'RACE_PREF_USER_SELECTABLE';
        }
    }
};
