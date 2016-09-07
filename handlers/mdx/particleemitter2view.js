function MdxParticleEmitter2View(instance, emitter) {
    this.instance = instance;
    this.emitter = emitter;
    this.currentEmission = 0;
}

MdxParticleEmitter2View.prototype = {
    update(allowCreate) {
        if (allowCreate && this.shouldRender()) {
            let emitter = this.emitter;

            this.currentEmission += this.getEmissionRate() * this.instance.model.env.frameTimeS;

            if (this.currentEmission >= 1) {
                for (let i = 0, l = Math.floor(this.currentEmission); i < l; i++) {
                    emitter.emit(this.instance);

                    this.currentEmission -= 1;
                }
            }
        }
    },

    shouldRender() {
        return this.getVisibility() > 0.75;
    },

    getWidth() {
        return this.emitter.getWidth(this.instance);
    },

    getLength() {
        return this.emitter.getLength(this.instance);
    },

    getSpeed() {
        return this.emitter.getSpeed(this.instance);
    },

    getLatitude() {
        return this.emitter.getLatitude(this.instance);
    },

    getGravity() {
        return this.emitter.getGravity(this.instance);
    },

    getEmissionRate() {
        return this.emitter.getEmissionRate(this.instance);
    },

    getVisibility() {
        return this.emitter.getVisibility(this.instance);
    }

    //getVariation(sequence, frame, counter) {
    //    return this.sd.getKP2R(sequence, frame, counter, ?);
    //}
};
