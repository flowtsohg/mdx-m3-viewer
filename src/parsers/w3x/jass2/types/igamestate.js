import JassGameState from './gamestate';

export default class JassIGameState extends JassGameState {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 0: return 'GAME_STATE_DIVINE_INTERVENTION';
            case 1: return 'GAME_STATE_DISCONNECTED';
        }
    }
};
