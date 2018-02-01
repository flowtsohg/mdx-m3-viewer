import JassAgent from './agent';

export default class JassTrigger extends JassAgent {
	constructor(jassContext) {
        super(jassContext);
        
        this.enabled = true;
	}

    toString() {
        return `trigger(${this.enabled})`;
    }
};
