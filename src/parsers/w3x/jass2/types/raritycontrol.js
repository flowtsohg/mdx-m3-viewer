import JassHandle from './handle';

export default class JassRarityControl extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 0: return 'RARITY_FREQUENT';
            case 1: return 'RARITY_RARE';
        }
    }
};
