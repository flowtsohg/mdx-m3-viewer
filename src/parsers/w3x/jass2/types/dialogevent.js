import JassEventId from './eventid';

export default class JassDialogEvent extends JassEventId {
	constructor(jassContext, value) {
        super(jassContext);
        
        this.handleId = value;
	}

    toString() {
        switch (this.handleId) {
            case 90: return 'EVENT_DIALOG_BUTTON_CLICK';
            case 91: return 'EVENT_DIALOG_CLICK';
        }
    }
};
