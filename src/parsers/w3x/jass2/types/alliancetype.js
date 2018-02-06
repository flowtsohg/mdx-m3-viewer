import JassHandle from './handle';

export default class JassAllianceType extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);

        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'ALLIANCE_PASSIVE';
            case 1: return 'ALLIANCE_HELP_REQUEST';
            case 2: return 'ALLIANCE_HELP_RESPONSE';
            case 3: return 'ALLIANCE_SHARED_XP';
            case 4: return 'ALLIANCE_SHARED_SPELLS';
            case 5: return 'ALLIANCE_SHARED_VISION';
            case 6: return 'ALLIANCE_SHARED_CONTROL';
            case 7: return 'ALLIANCE_SHARED_ADVANCED_CONTROL';
            case 8: return 'ALLIANCE_RESCUABLE';
            case 9: return 'ALLIANCE_SHARED_VISION_FORCED';
        }
    }
};
