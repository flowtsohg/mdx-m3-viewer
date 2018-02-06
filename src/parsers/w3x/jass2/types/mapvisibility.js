import JassHandle from './handle';

export default class JassMapVisibility extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        return `mapvisibility(${this.handleId}})`;
    }
};
