import JassHandle from './handle';

export default class JassPlacement extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'MAP_PLACEMENT_RANDOM';
            case 1: return 'MAP_PLACEMENT_FIXED';
            case 2: return 'MAP_PLACEMENT_USE_MAP_SETTINGS';
            case 3: return 'MAP_PLACEMENT_TEAMS_TOGETHER';  
        }
    }
};
