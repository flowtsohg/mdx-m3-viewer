import JassHandle from './handle';

export default class JassMapFlag extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 1: return 'MAP_FOG_HIDE_TERRAIN';
            case 2: return 'MAP_FOG_MAP_EXPLORED';
            case 4: return 'MAP_FOG_ALWAYS_VISIBLE';
            case 8: return 'MAP_USE_HANDICAPS';
            case 16: return 'MAP_OBSERVERS';
            case 32: return 'MAP_OBSERVERS_ON_DEATH';
            case 128: return 'MAP_FIXED_COLORS';
            case 256: return 'MAP_LOCK_RESOURCE_TRADING';
            case 512: return 'MAP_RESOURCE_TRADING_ALLIES_ONLY';
            case 1024: return 'MAP_LOCK_ALLIANCE_CHANGES';
            case 2048: return 'MAP_ALLIANCE_CHANGES_HIDDEN';
            case 4096: return 'MAP_CHEATS';
            case 8192: return 'MAP_CHEATS_HIDDEN';
            case 16384: return 'MAP_LOCK_SPEED';
            case 32768: return 'MAP_LOCK_RANDOM_SEED';
            case 65536: return 'MAP_SHARED_ADVANCED_CONTROL';
            case 131072: return 'MAP_RANDOM_HERO';
            case 262144: return 'MAP_RANDOM_RACES';
            case 524288: return 'MAP_RELOADED';
        }
    }
};
