export default class JassVolumeGroup {
	constructor(jassContext, value) {
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 0: return 'SOUND_VOLUMEGROUP_UNITMOVEMENT';
            case 1: return 'SOUND_VOLUMEGROUP_UNITSOUNDS';
            case 2: return 'SOUND_VOLUMEGROUP_COMBAT';
            case 3: return 'SOUND_VOLUMEGROUP_SPELLS';
            case 4: return 'SOUND_VOLUMEGROUP_UI';
            case 5: return 'SOUND_VOLUMEGROUP_MUSIC';
            case 6: return 'SOUND_VOLUMEGROUP_AMBIENTSOUNDS';
            case 7: return 'SOUND_VOLUMEGROUP_FIRE';
        }
    }
};
