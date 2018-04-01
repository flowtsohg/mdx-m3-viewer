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
            track = emitter.modelObject.getValue(this.instance),
            lastTrack = this.lastTrack;

        if (track[0] === 1 && (track[0] !== lastTrack[0] || track[1] !== lastTrack[1])) {
            emitter.emit(this);
        }

        lastTrack[0] = track[0];
        lastTrack[1] = track[1];
        //vec2.copy(lastTrack, track);
    }
};
