import JassHandle from './handle';

export default class JassPathingType extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 0: return 'PATHING_TYPE_ANY';
            case 1: return 'PATHING_TYPE_WALKABILITY';
            case 2: return 'PATHING_TYPE_FLYABILITY';
            case 3: return 'PATHING_TYPE_BUILDABILITY';
            case 4: return 'PATHING_TYPE_PEONHARVESTPATHING';
            case 5: return 'PATHING_TYPE_BLIGHTPATHING';
            case 6: return 'PATHING_TYPE_FLOATABILITY';
            case 7: return 'PATHING_TYPE_AMPHIBIOUSPATHING';
        }
    }
};
