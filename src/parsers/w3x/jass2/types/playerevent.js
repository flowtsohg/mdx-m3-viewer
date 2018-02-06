import JassEventId from './eventid';

export default class JassPlayerEvent extends JassEventId {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 11: return 'EVENT_PLAYER_STATE_LIMIT';
            case 12: return 'EVENT_PLAYER_ALLIANCE_CHANGED';
            case 13: return 'EVENT_PLAYER_DEFEAT';
            case 14: return 'EVENT_PLAYER_VICTORY';
            case 15: return 'EVENT_PLAYER_LEAVE';
            case 16: return 'EVENT_PLAYER_CHAT';
            case 17: return 'EVENT_PLAYER_END_CINEMATIC';
            case 261: return 'EVENT_PLAYER_ARROW_LEFT_DOWN';
            case 262: return 'EVENT_PLAYER_ARROW_LEFT_UP';
            case 263: return 'EVENT_PLAYER_ARROW_RIGHT_DOWN';
            case 264: return 'EVENT_PLAYER_ARROW_RIGHT_UP';
            case 265: return 'EVENT_PLAYER_ARROW_DOWN_DOWN';
            case 266: return 'EVENT_PLAYER_ARROW_DOWN_UP';
            case 267: return 'EVENT_PLAYER_ARROW_UP_DOWN';
            case 268: return 'EVENT_PLAYER_ARROW_UP_UP';
        }
    }
};
