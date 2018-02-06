import JassEventId from './eventid';

export default class JassWidgetEvent extends JassEventId {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 89: return 'EVENT_WIDGET_DEATH';
        }
    }
};
