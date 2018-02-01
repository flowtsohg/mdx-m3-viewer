import JassHandle from './handle';

export default class JassMapSetting extends JassHandle {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        return `mapsetting(${this.value}})`;
    }
};
