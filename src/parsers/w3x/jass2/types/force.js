import JassAgent from './agent';

export default class JassForce extends JassAgent {
	constructor(jassContext) {
        super(jassContext);
        
        this.players = new Set();
	}

    toString() {
        return `[type=force handle=${this.handleId}]`;
    }
};
