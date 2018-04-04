import { vec2 } from 'gl-matrix';

// Heap allocations needed for this module.
let track = vec2.create();

export default class MdxEventObjectEmitterView {
    /**
     * @param {MdxModelInstance} instance
     * @param {MdxEventObjectEmitter} emitter
     */
    constructor(instance, emitter) {
        this.instance = instance;
        this.emitter = emitter;
        this.lastTrack = [0, 0];
    }

    update() {
        let emitter = this.emitter,
            lastTrack = this.lastTrack;

        emitter.modelObject.getValue(track, this.instance);

        if (track[0] === 1 && (track[0] !== lastTrack[0] || track[1] !== lastTrack[1])) {
            emitter.emit(this);
        }

        lastTrack[0] = track[0];
        lastTrack[1] = track[1];
        //vec2.copy(lastTrack, track);
    }
};
