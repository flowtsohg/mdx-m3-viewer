import JassHandle from './handle';

export default class JassGameDifficulty extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'MAP_DIFFICULTY_EASY';
            case 1: return 'MAP_DIFFICULTY_NORMAL';
            case 2: return 'MAP_DIFFICULTY_HARD';
            case 3: return 'MAP_DIFFICULTY_INSANE';
        }
    }
};
