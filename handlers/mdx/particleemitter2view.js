/**
 * @constructor
 * @param {MdxModelInstance} instance
 */
function MdxParticleEmitter2View(instance) {
    this.instance = instance;
    this.currentEmission = 0;
}

MdxParticleEmitter2View.prototype = {
    update(allowCreate) {
        /*
        let instance = this.instance;

        if (instance.bucket && allowCreate && this.shouldRender()) {
            let emitter = this.instance.modelView.particleEmitters[this.index];

            this.currentEmission += this.getEmissionRate() * instance.model.env.frameTime * 0.001;

            if (this.currentEmission >= 1) {
                for (let i = 0, l = Math.floor(this.currentEmission); i < l; i++) {
                    emitter.emit(instance);

                    this.currentEmission -= 1;
                }
            }
        }
        */
    },

    shouldRender() {
        return this.emitter.shouldRender(this.instance);
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
