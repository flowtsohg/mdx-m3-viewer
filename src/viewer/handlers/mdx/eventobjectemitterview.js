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
        this.currentEmission = 0;
    }

    update() {
        let emitter = this.emitter,
            lastTrack = this.lastTrack;

        emitter.getValue(track, this.instance);

        if (track[0] === 1 && (track[0] !== lastTrack[0] || track[1] !== lastTrack[1])) {
            this.currentEmission += 1;
        }

        lastTrack[0] = track[0];
        lastTrack[1] = track[1];
    }
};
