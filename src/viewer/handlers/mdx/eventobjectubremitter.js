import SharedGeometryEmitter from './sharedgeometryemitter';
import EventObjectUbr from './eventobjectubr';

export default class EventObjectUbrEmitter extends SharedGeometryEmitter {
    constructor(modelObject) {
        super(modelObject);

        this.type = 'UBR';
        this.bytesPerEmit = 4 * 30;
    }

    emit(emitterView) {
        if (this.modelObject.ready) {
            this.emitObject(emitterView);
        }
    }

    createObject() {
        return new EventObjectUbr(this);
    }
};
