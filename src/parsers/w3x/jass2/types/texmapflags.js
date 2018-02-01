import JassHandle from './handle';

export default class JassTexMapFlags extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 0: return 'TEXMAP_FLAG_NONE';
            case 1: return 'TEXMAP_FLAG_WRAP_U';
            case 2: return 'TEXMAP_FLAG_WRAP_V';
            case 3: return 'TEXMAP_FLAG_WRAP_UV';
        }
    }
};
