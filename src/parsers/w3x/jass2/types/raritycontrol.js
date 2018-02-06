import JassHandle from './handle';

export default class JassRarityControl extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'RARITY_FREQUENT';
            case 1: return 'RARITY_RARE';
        }
    }
};
