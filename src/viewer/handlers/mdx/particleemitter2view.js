export default class MdxParticleEmitter2View {
    /**
     * @param {MdxModelInstance} instance
     * @param {MdxParticle2Emitter} emitter
     */
    constructor(instance, emitter) {
        this.instance = instance;
        this.emitter = emitter;
        this.currentEmission = 0;
        this.lastEmissionKey = -1;
    }

    update() {
        if (this.shouldRender()) {
            let emitter = this.emitter;

            if (emitter.modelObject.squirt) {
                let keyframe = this.getEmissionRateKeyframe();

                if (keyframe !== this.lastEmissionKey) {
                    this.currentEmission += this.getEmissionRate();
                }

                this.lastEmissionKey = keyframe;
            } else {
                this.currentEmission += this.getEmissionRate() * this.instance.env.frameTime * 0.001;
            }

            if (this.currentEmission >= 1) {
                for (let i = 0, l = Math.floor(this.currentEmission); i < l; i++ , this.currentEmission--) {
                    emitter.emit(this);
                }
            }
        }
    }

    shouldRender() {
        return this.emitter.shouldRender(this.instance);
    }

    getWidth() {
        return this.emitter.getWidth(this.instance);
    }

    getLength() {
        return this.emitter.getLength(this.instance);
    }

    getSpeed() {
        return this.emitter.getSpeed(this.instance);
    }

    getLatitude() {
        return this.emitter.getLatitude(this.instance);
    }

    getGravity() {
        return this.emitter.getGravity(this.instance);
    }

    getEmissionRate() {
        return this.emitter.getEmissionRate(this.instance);
    }

    getEmissionRateKeyframe() {
        return this.emitter.getEmissionRateKeyframe(this.instance);
    }

    getVisibility() {
        return this.emitter.getVisibility(this.instance);
    }

    getVariation(sequence, frame, counter) {
        return this.emitter.getVariation(this.instance);
    }
};
