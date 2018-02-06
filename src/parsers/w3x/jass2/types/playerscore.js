import JassHandle from './handle';

export default class JassPlayerScore extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'PLAYER_SCORE_UNITS_TRAINED';
            case 1: return 'PLAYER_SCORE_UNITS_KILLED';
            case 2: return 'PLAYER_SCORE_STRUCT_BUILT';
            case 3: return 'PLAYER_SCORE_STRUCT_RAZED';
            case 4: return 'PLAYER_SCORE_TECH_PERCENT';
            case 5: return 'PLAYER_SCORE_FOOD_MAXPROD';
            case 6: return 'PLAYER_SCORE_FOOD_MAXUSED';
            case 7: return 'PLAYER_SCORE_HEROES_KILLED';
            case 8: return 'PLAYER_SCORE_ITEMS_GAINED';
            case 9: return 'PLAYER_SCORE_MERCS_HIRED';
            case 10: return 'PLAYER_SCORE_GOLD_MINED_TOTAL';
            case 11: return 'PLAYER_SCORE_GOLD_MINED_UPKEEP';
            case 12: return 'PLAYER_SCORE_GOLD_LOST_UPKEEP';
            case 13: return 'PLAYER_SCORE_GOLD_LOST_TAX';
            case 14: return 'PLAYER_SCORE_GOLD_GIVEN';
            case 15: return 'PLAYER_SCORE_GOLD_RECEIVED';
            case 16: return 'PLAYER_SCORE_LUMBER_TOTAL';
            case 17: return 'PLAYER_SCORE_LUMBER_LOST_UPKEEP';
            case 18: return 'PLAYER_SCORE_LUMBER_LOST_TAX';
            case 19: return 'PLAYER_SCORE_LUMBER_GIVEN';
            case 20: return 'PLAYER_SCORE_LUMBER_RECEIVED';
            case 21: return 'PLAYER_SCORE_UNIT_TOTAL';
            case 22: return 'PLAYER_SCORE_HERO_TOTAL';
            case 23: return 'PLAYER_SCORE_RESOURCE_TOTAL';
            case 24: return 'PLAYER_SCORE_TOTAL';
            case 25: return 'PLAYER_SCORE_LUMBER_LOST_UPKEEP';
            case 26: return 'PLAYER_SCORE_LUMBER_LOST_UPKEEP';
            case 27: return 'PLAYER_SCORE_LUMBER_LOST_UPKEEP';
            case 28: return 'PLAYER_SCORE_LUMBER_LOST_UPKEEP';
            case 29: return 'PLAYER_SCORE_LUMBER_LOST_UPKEEP';
        }
    }
};
