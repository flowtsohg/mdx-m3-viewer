import JassHandle from './handle';

export default class JassUnitType extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 0: return 'UNIT_TYPE_HERO';
            case 1: return 'UNIT_TYPE_DEAD';
            case 2: return 'UNIT_TYPE_STRUCTURE';
            case 3: return 'UNIT_TYPE_FLYING';
            case 4: return 'UNIT_TYPE_GROUND';
            case 5: return 'UNIT_TYPE_ATTACKS_FLYING';
            case 6: return 'UNIT_TYPE_ATTACKS_GROUND';
            case 7: return 'UNIT_TYPE_MELEE_ATTACKER';
            case 8: return 'UNIT_TYPE_RANGED_ATTACKER';
            case 9: return 'UNIT_TYPE_GIANT';
            case 10: return 'UNIT_TYPE_SUMMONED';
            case 11: return 'UNIT_TYPE_STUNNED';
            case 12: return 'UNIT_TYPE_PLAGUED';
            case 13: return 'UNIT_TYPE_SNARED';
            case 14: return 'UNIT_TYPE_UNDEAD';
            case 15: return 'UNIT_TYPE_MECHANICAL';
            case 16: return 'UNIT_TYPE_PEON';
            case 17: return 'UNIT_TYPE_SAPPER';
            case 18: return 'UNIT_TYPE_TOWNHALL';    
            case 19: return 'UNIT_TYPE_ANCIENT';
            case 20: return 'UNIT_TYPE_TAUREN';
            case 21: return 'UNIT_TYPE_POISONED';
            case 22: return 'UNIT_TYPE_POLYMORPHED';
            case 23: return 'UNIT_TYPE_SLEEPING';
            case 24: return 'UNIT_TYPE_RESISTANT';
            case 25: return 'UNIT_TYPE_ETHEREAL';
            case 26: return 'UNIT_TYPE_MAGIC_IMMUNE';
        }
    }
};
