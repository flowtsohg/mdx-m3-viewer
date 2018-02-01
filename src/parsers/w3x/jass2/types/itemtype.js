import JassHandle from './handle';

export default class JassItemType extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 0: return 'ITEM_TYPE_PERMANENT';
            case 1: return 'ITEM_TYPE_CHARGED';
            case 2: return 'ITEM_TYPE_POWERUP';
            case 3: return 'ITEM_TYPE_ARTIFACT';
            case 4: return 'ITEM_TYPE_PURCHASABLE';
            case 5: return 'ITEM_TYPE_CAMPAIGN';
            case 6: return 'ITEM_TYPE_MISCELLANEOUS';
            case 7: return 'ITEM_TYPE_UNKNOWN';
            case 8: return 'ITEM_TYPE_ANY';
        }
    }
};
