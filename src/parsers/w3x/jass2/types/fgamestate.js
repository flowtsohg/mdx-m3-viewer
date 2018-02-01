import JassGameState from './gamestate';

export default class JassFGameState extends JassGameState {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 2: return 'GAME_STATE_TIME_OF_DAY';
        }
    }
};