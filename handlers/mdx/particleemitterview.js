/**
 * @constructor
 * @param {MdxModelInstance} instance
 * @param {MdxParticleEmitter} emitter
 */
function MdxParticleEmitterView(instance, emitter) {
    this.instance = instance;
    this.emitter = emitter;
    this.currentEmission = 0;
}

MdxParticleEmitterView.prototype = {
    update() {
        if (this.shouldRender()) {
            let emitter = this.emitter;

            this.currentEmission += this.getEmissionRate() * this.instance.env.frameTime * 0.001;

            if (this.currentEmission >= 1) {
                for (let i = 0, l = Math.floor(this.currentEmission) ; i < l; i++, this.currentEmission--) {
                    emitter.emit(this);
                }
            }
        }
    },

    shouldRender() {
        return this.emitter.shouldRender(this.instance);
    },

    getSpeed() {
        return this.emitter.getSpeed(this.instance);
    },

    getLatitude() {
        return this.emitter.getLatitude(this.instance);
    },

    getLongitude() {
        return this.emitter.getLongitude(this.instance);
    },

    getLifespan() {
        return this.emitter.getLifespan(this.instance);
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
};

export default MdxParticleEmitterView;
