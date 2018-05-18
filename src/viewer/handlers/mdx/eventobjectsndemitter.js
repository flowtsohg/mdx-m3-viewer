import SharedEmitter from './sharedemitter';
import EventObjectSnd from './eventobjectsnd';

export default class EventObjectSndEmitter extends SharedEmitter {
    constructor(modelObject) {
        super(modelObject);

        this.type = 'SND';
    }

    emit(emitterView) {
        if (this.modelObject.ready) {
            this.emitObject(emitterView);
        }
    }

    createObject() {
        return new EventObjectSnd(this);
    }

    emit(emitterView) {
        let eventEmitter = this.modelObject;

        if (eventEmitter.ready) {
            let viewer = eventEmitter.model.viewer;

            if (viewer.audioEnabled) {
                let scene = emitterView.instance.scene,
                    audioContext = scene.audioContext;

                if (audioContext && audioContext.state === 'running') {
                    this.emitObject(emitterView);
                }
            }
        }
    }
};
