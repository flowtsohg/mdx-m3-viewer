import JassHandle from './handle';

export default class JassPlayerState extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 0: return 'PLAYER_STATE_GAME_RESULT';
            case 1: return 'PLAYER_STATE_RESOURCE_GOLD';
            case 2: return 'PLAYER_STATE_RESOURCE_LUMBER';
            case 3: return 'PLAYER_STATE_RESOURCE_HERO_TOKENS';
            case 4: return 'PLAYER_STATE_RESOURCE_FOOD_CAP';
            case 5: return 'PLAYER_STATE_RESOURCE_FOOD_USED';
            case 6: return 'PLAYER_STATE_FOOD_CAP_CEILING';
            case 7: return 'PLAYER_STATE_GIVES_BOUNTY';
            case 8: return 'PLAYER_STATE_ALLIED_VICTORY';
            case 9: return 'PLAYER_STATE_PLACED';
            case 10: return 'PLAYER_STATE_OBSERVER_ON_DEATH';
            case 11: return 'PLAYER_STATE_OBSERVER';
            case 12: return 'PLAYER_STATE_UNFOLLOWABLE';
            case 13: return 'PLAYER_STATE_GOLD_UPKEEP_RATE';
            case 14: return 'PLAYER_STATE_LUMBER_UPKEEP_RATE';
            case 15: return 'PLAYER_STATE_GOLD_GATHERED';
            case 16: return 'PLAYER_STATE_LUMBER_GATHERED';
            case 17: return 'PLAYER_STATE_NO_CREEP_SLEEP';
        }
    }
};
