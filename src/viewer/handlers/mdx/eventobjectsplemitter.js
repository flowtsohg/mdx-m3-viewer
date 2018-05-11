import SharedGeometryEmitter from './sharedgeometryemitter';
import EventObjectSpl from './eventobjectspl';

export default class EventObjectSplEmitter extends SharedGeometryEmitter {
    constructor(modelObject) {
        super(modelObject);

        this.type = 'SPL';
        this.bytesPerEmit = 4 * 30;
    }

    emit(emitterView) {
        if (this.modelObject.ready) {
            this.emitObject(emitterView);
        }
    }

    createObject() {
        return new EventObjectSpl(this);
    }
};
