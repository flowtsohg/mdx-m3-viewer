import JassHandle from './handle';

export default class JassGameType extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 1: return 'GAME_TYPE_MELEE';
            case 2: return 'GAME_TYPE_FFA';
            case 4: return 'GAME_TYPE_USE_MAP_SETTINGS';
            case 8: return 'GAME_TYPE_BLIZ';
            case 16: return 'GAME_TYPE_ONE_ON_ONE';
            case 32: return 'GAME_TYPE_TWO_TEAM_PLAY';
            case 64: return 'GAME_TYPE_THREE_TEAM_PLAY';
            case 128: return 'GAME_TYPE_FOUR_TEAM_PLAY';
        }
    }
};
