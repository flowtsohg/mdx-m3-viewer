import JassHandle from './handle';

export default class JassSoundType extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'SOUND_TYPE_EFFECT';
            case 1: return 'SOUND_TYPE_EFFECT_LOOPED';
        }
    }
};
