import JassHandle from './handle';

export default class JassAttackType extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'ATTACK_TYPE_NORMAL';
            case 1: return 'ATTACK_TYPE_MELEE';
            case 2: return 'ATTACK_TYPE_PIERCE';
            case 3: return 'ATTACK_TYPE_SIEGE';
            case 4: return 'ATTACK_TYPE_MAGIC';
            case 5: return 'ATTACK_TYPE_CHAOS';
            case 6: return 'ATTACK_TYPE_HERO';
        }
    }
};
