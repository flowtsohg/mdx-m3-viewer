import JassHandle from './handle';

export default class JassPlayerColor extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 0: return 'PLAYER_COLOR_RED';
            case 1: return 'PLAYER_COLOR_BLUE';
            case 2: return 'PLAYER_COLOR_CYAN';
            case 3: return 'PLAYER_COLOR_PURPLE';
            case 4: return 'PLAYER_COLOR_YELLOW';
            case 5: return 'PLAYER_COLOR_ORANGE';
            case 6: return 'PLAYER_COLOR_GREEN';
            case 7: return 'PLAYER_COLOR_PINK';
            case 8: return 'PLAYER_COLOR_LIGHT_GRAY';
            case 9: return 'PLAYER_COLOR_LIGHT_BLUE';
            case 10: return 'PLAYER_COLOR_AQUA';
            case 11: return 'PLAYER_COLOR_BROWN';
        }
    }
};
