import JassHandle from './handle';

export default class JassPlayerGameResult extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);

        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'PLAYER_GAME_RESULT_VICTORY';
            case 1: return 'PLAYER_GAME_RESULT_DEFEAT';
            case 2: return 'PLAYER_GAME_RESULT_TIE';
            case 3: return 'PLAYER_GAME_RESULT_NEUTRAL';
        }
    }
};
