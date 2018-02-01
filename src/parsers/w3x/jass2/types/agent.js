import JassHandle from './handle';

export default class JassAgent extends JassHandle {
	constructor(jassContext) {
        super(jassContext);

		this.references = 0;
	}

    addReference(name) {
        this.references += 1;
    }

    removeReference() {
        this.references -= 1;
    }
};
