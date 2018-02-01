import JassEventId from './eventid';

export default class JassUnitEvent extends JassEventId {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 52: return 'EVENT_UNIT_DAMAGED';
            case 53: return 'EVENT_UNIT_DEATH';
            case 54: return 'EVENT_UNIT_DECAY';
            case 55: return 'EVENT_UNIT_DETECTED';
            case 56: return 'EVENT_UNIT_HIDDEN';
            case 57: return 'EVENT_UNIT_SELECTED';
            case 58: return 'EVENT_UNIT_DESELECTED';
            case 59: return 'EVENT_UNIT_STATE_LIMIT';                                                                        
            case 60: return 'EVENT_UNIT_ACQUIRED_TARGET';
            case 61: return 'EVENT_UNIT_TARGET_IN_RANGE';
            case 62: return 'EVENT_UNIT_ATTACKED';
            case 63: return 'EVENT_UNIT_RESCUED';
            case 64: return 'EVENT_UNIT_CONSTRUCT_CANCEL';
            case 65: return 'EVENT_UNIT_CONSTRUCT_FINISH';
            case 66: return 'EVENT_UNIT_UPGRADE_START';
            case 67: return 'EVENT_UNIT_UPGRADE_CANCEL';
            case 68: return 'EVENT_UNIT_UPGRADE_FINISH';              
            case 69: return 'EVENT_UNIT_TRAIN_START';
            case 70: return 'EVENT_UNIT_TRAIN_CANCEL';
            case 71: return 'EVENT_UNIT_TRAIN_FINISH';
            case 72: return 'EVENT_UNIT_RESEARCH_START';
            case 73: return 'EVENT_UNIT_RESEARCH_CANCEL';
            case 74: return 'EVENT_UNIT_RESEARCH_FINISH';
            case 75: return 'EVENT_UNIT_ISSUED_ORDER';
            case 76: return 'EVENT_UNIT_ISSUED_POINT_ORDER';
            case 77: return 'EVENT_UNIT_ISSUED_TARGET_ORDER';
            case 78: return 'EVENT_UNIT_HERO_LEVEL';
            case 79: return 'EVENT_UNIT_HERO_SKILL';   
            case 80: return 'EVENT_UNIT_HERO_REVIVABLE';
            case 81: return 'EVENT_UNIT_HERO_REVIVE_START';
            case 82: return 'EVENT_UNIT_HERO_REVIVE_CANCEL';
            case 83: return 'EVENT_UNIT_HERO_REVIVE_FINISH';
            case 84: return 'EVENT_UNIT_SUMMON';
            case 85: return 'EVENT_UNIT_DROP_ITEM';
            case 86: return 'EVENT_UNIT_PICKUP_ITEM';
            case 87: return 'EVENT_UNIT_USE_ITEM';
            case 88: return 'EVENT_UNIT_LOADED';
            case 286: return 'EVENT_UNIT_SELL';
            case 287: return 'EVENT_UNIT_CHANGE_OWNER';
            case 288: return 'EVENT_UNIT_SELL_ITEM';
            case 289: return 'EVENT_UNIT_SPELL_CHANNEL';
            case 290: return 'EVENT_UNIT_SPELL_CAST';
            case 291: return 'EVENT_UNIT_SPELL_EFFECT';
            case 292: return 'EVENT_UNIT_SPELL_FINISH';
            case 293: return 'EVENT_UNIT_SPELL_ENDCAST';
            case 294: return 'EVENT_UNIT_PAWN_ITEM';
        }
    }
};
