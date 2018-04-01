export default class JassHandle {
    constructor(jassContext) {
        this.jassContext = jassContext;
        this.handleId = -1;
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
        // This automatically handles all of the constant global handles.
        if (this.handleNames.length) {
            return this.handleNames[0];
        }

        return `HANDLE_${this.handleId}`;
    }
};
