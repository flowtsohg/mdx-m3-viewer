import JassHandle from './handle';

export default class JassAiDifficulty extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'AI_DIFFICULTY_NEWBIE';
            case 1: return 'AI_DIFFICULTY_NORMAL';
            case 2: return 'AI_DIFFICULTY_INSANE';
        }
    }
};
