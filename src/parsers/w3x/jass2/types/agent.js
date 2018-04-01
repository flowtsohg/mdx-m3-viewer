import JassHandle from './handle';

export default class JassAgent extends JassHandle {
    constructor(jassContext) {
        super(jassContext);

        this.references = new Set();
    }

    addReference(reference) {
        this.references.add(reference);
    }

    removeReference(reference) {
        this.references.delete(reference);
    }
};
