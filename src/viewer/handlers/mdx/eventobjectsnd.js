/**
 * There isn't any real reason to have SND event objects.
 * This is because the audio API is used in a fire and forget manner, there's no state to keep track of.
 * But this keeps the code consistent.
 */
export default class EventObjectSnd {
    /**
     * @param {MdxEventObjectEmitter} emitter
     */
    constructor(emitter) {
        this.emitter = emitter;
        this.health = 0;
    }

    reset(emitterView) {
        let scene = emitterView.instance.scene,
            audioContext = scene.audioContext,
            source = audioContext.createBufferSource(),
            volume = audioContext.createGain(),
            panner = audioContext.createPanner(),
            emitter = emitterView.emitter;
        
        source.buffer = emitter.decodedBuffer;
        
        panner.setPosition(...emitterView.instance.nodes[emitter.objectId].worldLocation);
        panner.maxDistance = emitter.distanceCutoff;
        panner.refDistance = emitter.minDistance;
        panner.connect(audioContext.destination);

        source.connect(panner);
        source.start(0);

        // Live!
        this.health = 1;
        
        // But when the source ends, die.
        source.onended = () => {
            this.health = 0;
        };
    }

    update() {

    }
};
