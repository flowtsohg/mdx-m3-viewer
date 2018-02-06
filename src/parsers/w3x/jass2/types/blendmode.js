import JassHandle from './handle';

export default class JassBlendMode extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'BLEND_MODE_NONE';
            case 0: return 'BLEND_MODE_DONT_CARE';
            case 1: return 'BLEND_MODE_KEYALPHA';
            case 2: return 'BLEND_MODE_BLEND';
            case 3: return 'BLEND_MODE_ADDITIVE';
            case 4: return 'BLEND_MODE_MODULATE';
            case 5: return 'BLEND_MODE_MODULATE_2X';
        }
    }
};
