import JassEventId from './eventid';

export default class JassGameEvent extends JassEventId {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'EVENT_GAME_VICTORY';
            case 1: return 'EVENT_GAME_END_LEVEL';
            case 2: return 'EVENT_GAME_VARIABLE_LIMIT';
            case 3: return 'EVENT_GAME_STATE_LIMIT';
            case 4: return 'EVENT_GAME_TIMER_EXPIRED';
            case 5: return 'EVENT_GAME_ENTER_REGION';
            case 6: return 'EVENT_GAME_LEAVE_REGION';
            case 7: return 'EVENT_GAME_TRACKABLE_HIT';
            case 8: return 'EVENT_GAME_TRACKABLE_TRACK';
            case 9: return 'EVENT_GAME_SHOW_SKILL';
            case 10: return 'EVENT_GAME_BUILD_SUBMENU';
        }
    }
};
