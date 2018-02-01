export default class JassWeaponType {
	constructor(jassContext, value) {
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 0: return 'WEAPON_TYPE_WHOKNOWS';
            case 1: return 'WEAPON_TYPE_METAL_LIGHT_CHOP';
            case 2: return 'WEAPON_TYPE_METAL_MEDIUM_CHOP';
            case 3: return 'WEAPON_TYPE_METAL_HEAVY_CHOP';
            case 4: return 'WEAPON_TYPE_METAL_LIGHT_SLICE';
            case 5: return 'WEAPON_TYPE_METAL_MEDIUM_SLICE';
            case 6: return 'WEAPON_TYPE_METAL_HEAVY_SLICE';
            case 7: return 'WEAPON_TYPE_METAL_MEDIUM_BASH';
            case 8: return 'WEAPON_TYPE_METAL_HEAVY_BASH';
            case 9: return 'WEAPON_TYPE_METAL_MEDIUM_STAB';
            case 10: return 'WEAPON_TYPE_METAL_HEAVY_STAB';
            case 11: return 'WEAPON_TYPE_WOOD_LIGHT_SLICE';
            case 12: return 'WEAPON_TYPE_WOOD_MEDIUM_SLICE';
            case 13: return 'WEAPON_TYPE_WOOD_HEAVY_SLICE';
            case 14: return 'WEAPON_TYPE_WOOD_LIGHT_BASH';
            case 15: return 'WEAPON_TYPE_WOOD_MEDIUM_BASH';
            case 16: return 'WEAPON_TYPE_WOOD_HEAVY_BASH';
            case 17: return 'WEAPON_TYPE_WOOD_LIGHT_STAB';
            case 18: return 'WEAPON_TYPE_WOOD_MEDIUM_STAB';
            case 19: return 'WEAPON_TYPE_CLAW_LIGHT_SLICE';
            case 20: return 'WEAPON_TYPE_CLAW_MEDIUM_SLICE';
            case 21: return 'WEAPON_TYPE_CLAW_HEAVY_SLICE';
            case 22: return 'WEAPON_TYPE_AXE_MEDIUM_CHOP';
            case 23: return 'WEAPON_TYPE_ROCK_HEAVY_BASH';
        }
    }
};
