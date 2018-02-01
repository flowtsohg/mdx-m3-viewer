import JassHandle from './handle';

export default class JassPlayerSlotState extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 0: return 'PLAYER_SLOT_STATE_EMPTY';
            case 1: return 'PLAYER_SLOT_STATE_PLAYING';
            case 2: return 'PLAYER_SLOT_STATE_LEFT';
        }
    }
};
