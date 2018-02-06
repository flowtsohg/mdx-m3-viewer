import JassHandle from './handle';

export default class JassMapDensity extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 0: return 'MAP_DENSITY_NONE';
            case 1: return 'MAP_DENSITY_LIGHT';
            case 2: return 'MAP_DENSITY_MEDIUM';
            case 3: return 'MAP_DENSITY_HEAVY';
        }
    }
};
