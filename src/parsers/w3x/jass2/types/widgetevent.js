import JassEventId from './eventid';

export default class JassWidgetEvent extends JassEventId {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.value = value;
	}

    toString() {
        switch (this.value) {
            case 89: return 'EVENT_WIDGET_DEATH';
        }
    }
};
