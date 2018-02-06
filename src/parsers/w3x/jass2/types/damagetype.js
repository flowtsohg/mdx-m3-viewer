import JassHandle from './handle';

export default class JassDamageType extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);

        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'DAMAGE_TYPE_UNKNOWN';
            case 4: return 'DAMAGE_TYPE_NORMAL';
            case 5: return 'DAMAGE_TYPE_ENHANCED';
            case 8: return 'DAMAGE_TYPE_FIRE';
            case 9: return 'DAMAGE_TYPE_COLD';
            case 10: return 'DAMAGE_TYPE_LIGHTNING';
            case 11: return 'DAMAGE_TYPE_POISON';
            case 12: return 'DAMAGE_TYPE_DISEASE';
            case 13: return 'DAMAGE_TYPE_DIVINE';
            case 14: return 'DAMAGE_TYPE_MAGIC';
            case 15: return 'DAMAGE_TYPE_SONIC';
            case 16: return 'DAMAGE_TYPE_ACID';
            case 17: return 'DAMAGE_TYPE_FORCE';
            case 18: return 'DAMAGE_TYPE_DEATH';
            case 19: return 'DAMAGE_TYPE_MIND';
            case 20: return 'DAMAGE_TYPE_PLANT';
            case 21: return 'DAMAGE_TYPE_DEFENSIVE';
            case 22: return 'DAMAGE_TYPE_DEMOLITION';
            case 23: return 'DAMAGE_TYPE_SLOW_POISON';
            case 24: return 'DAMAGE_TYPE_SPIRIT_LINK';
            case 25: return 'DAMAGE_TYPE_SHADOW_STRIKE';
            case 26: return 'DAMAGE_TYPE_UNIVERSAL';
        }
    }
};
