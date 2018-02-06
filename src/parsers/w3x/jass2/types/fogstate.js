import JassHandle from './handle';

export default class JassFogState extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 1: return 'FOG_OF_WAR_MASKED';
            case 2: return 'FOG_OF_WAR_FOGGED';
            case 4: return 'FOG_OF_WAR_VISIBLE';
        }
    }
};
