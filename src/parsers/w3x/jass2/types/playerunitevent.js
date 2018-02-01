import JassEventId from './eventid';

export default class JassPlayerUnitEvent extends JassEventId {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 18: return 'EVENT_PLAYER_UNIT_ATTACKED';
            case 19: return 'EVENT_PLAYER_UNIT_RESCUED';
            case 20: return 'EVENT_PLAYER_UNIT_DEATH';
            case 21: return 'EVENT_PLAYER_UNIT_DECAY';
            case 22: return 'EVENT_PLAYER_UNIT_DETECTED';
            case 23: return 'EVENT_PLAYER_UNIT_HIDDEN';
            case 24: return 'EVENT_PLAYER_UNIT_SELECTED';
            case 25: return 'EVENT_PLAYER_UNIT_DESELECTED';
            case 26: return 'EVENT_PLAYER_UNIT_CONSTRUCT_START';
            case 27: return 'EVENT_PLAYER_UNIT_CONSTRUCT_CANCEL';
            case 28: return 'EVENT_PLAYER_UNIT_CONSTRUCT_FINISH';
            case 29: return 'EVENT_PLAYER_UNIT_UPGRADE_START';
            case 30: return 'EVENT_PLAYER_UNIT_UPGRADE_CANCEL';
            case 31: return 'EVENT_PLAYER_UNIT_UPGRADE_FINISH';
            case 32: return 'EVENT_PLAYER_UNIT_TRAIN_START';
            case 33: return 'EVENT_PLAYER_UNIT_TRAIN_CANCEL';
            case 34: return 'EVENT_PLAYER_UNIT_TRAIN_FINISH';
            case 35: return 'EVENT_PLAYER_UNIT_RESEARCH_START';
            case 36: return 'EVENT_PLAYER_UNIT_RESEARCH_CANCEL';
            case 37: return 'EVENT_PLAYER_UNIT_RESEARCH_FINISH';
            case 38: return 'EVENT_PLAYER_UNIT_ISSUED_ORDER';
            case 39: return 'EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER';
            case 40: return 'EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER';
            case 40: return 'EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER';
            case 41: return 'EVENT_PLAYER_HERO_LEVEL';
            case 42: return 'EVENT_PLAYER_HERO_SKILL';
            case 43: return 'EVENT_PLAYER_HERO_REVIVABLE';
            case 44: return 'EVENT_PLAYER_HERO_REVIVE_START';
            case 45: return 'EVENT_PLAYER_HERO_REVIVE_CANCEL';
            case 46: return 'EVENT_PLAYER_HERO_REVIVE_FINISH';
            case 47: return 'EVENT_PLAYER_UNIT_SUMMON';
            case 48: return 'EVENT_PLAYER_UNIT_DROP_ITEM';
            case 49: return 'EVENT_PLAYER_UNIT_PICKUP_ITEM';
            case 50: return 'EVENT_PLAYER_UNIT_USE_ITEM';
            case 51: return 'EVENT_PLAYER_UNIT_LOADED';
            case 269: return 'EVENT_PLAYER_UNIT_SELL';
            case 270: return 'EVENT_PLAYER_UNIT_CHANGE_OWNER';
            case 271: return 'EVENT_PLAYER_UNIT_SELL_ITEM';
            case 272: return 'EVENT_PLAYER_UNIT_SPELL_CHANNEL';
            case 273: return 'EVENT_PLAYER_UNIT_SPELL_CAST';
            case 274: return 'EVENT_PLAYER_UNIT_SPELL_EFFECT';
            case 275: return 'EVENT_PLAYER_UNIT_SPELL_FINISH';
            case 276: return 'EVENT_PLAYER_UNIT_SPELL_ENDCAST';
            case 277: return 'EVENT_PLAYER_UNIT_PAWN_ITEM';
        }
    }
};
