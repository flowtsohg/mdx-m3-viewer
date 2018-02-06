import JassGameState from './gamestate';

export default class JassFGameState extends JassGameState {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 2: return 'GAME_STATE_TIME_OF_DAY';
        }
    }
};