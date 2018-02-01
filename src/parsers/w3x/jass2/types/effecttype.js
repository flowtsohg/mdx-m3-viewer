import JassHandle from './handle';

export default class JassEffectType extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 0: return 'EFFECT_TYPE_EFFECT';
            case 1: return 'EFFECT_TYPE_TARGET';
            case 2: return 'EFFECT_TYPE_CASTER';
            case 3: return 'EFFECT_TYPE_SPECIAL';
            case 4: return 'EFFECT_TYPE_AREA_EFFECT';
            case 5: return 'EFFECT_TYPE_MISSILE';
            case 6: return 'EFFECT_TYPE_LIGHTNING';
        }
    }
};
