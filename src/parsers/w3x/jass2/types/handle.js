export default class JassHandle {
	constructor(jassContext) {
        this.jassContext = jassContext;
		this.handleId = jassContext.getAvailableHandle(this);
        this.handleNames = [];
	}

    addName(name) {
        this.handleNames.push(name);
    }

    kill() {
        this.handleId = -1;
        this.handleNames.length = [];
    }

    toString() {
        return `handle(${this.handleId}) ${this.handleNames.join('_')}`;
    }
};
