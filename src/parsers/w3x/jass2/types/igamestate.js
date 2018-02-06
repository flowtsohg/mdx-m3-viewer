import JassGameState from './gamestate';

export default class JassIGameState extends JassGameState {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'GAME_STATE_DIVINE_INTERVENTION';
            case 1: return 'GAME_STATE_DISCONNECTED';
        }
    }
};
