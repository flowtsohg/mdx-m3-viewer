import JassHandle from './handle';

export default class JassMapVisibility extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        return `mapvisibility(${this.value}})`;
    }
};
