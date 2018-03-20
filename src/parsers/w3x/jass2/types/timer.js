import JassAgent from './agent';

export default class JassTimer extends JassAgent {
	constructor(jassContext) {
        super(jassContext);
        
        this.elapsed = 0;
        this.timeout = 0;
        this.periodic = false;
        this.handlerFunc = null;
	}
};
