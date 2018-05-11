import SharedEmitter from './sharedemitter';
import EventObjectSpn from './eventobjectspn';

export default class EventObjectSpnEmitter extends SharedEmitter {
    constructor(modelObject) {
        super(modelObject);

        this.type = 'SPN';
    }

    emit(emitterView) {
        if (this.modelObject.ready) {
            this.emitObject(emitterView);
        }
    }

    createObject() {
        return new EventObjectSpn(this);
    }
};
