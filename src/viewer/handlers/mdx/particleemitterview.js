export default class ParticleEmitterView {
    /**
     * @param {MdxModelInstance} instance
     * @param {MdxParticleEmitter} emitter
     */
    constructor(instance, emitter) {
        this.instance = instance;
        this.emitter = emitter;
        this.currentEmission = 0;
    }

    update() {
        if (this.instance.allowParticleSpawn) {
            this.currentEmission += this.getEmissionRate() * this.instance.model.viewer.frameTime * 0.001;
        }
    }

    getSpeed() {
        return this.emitter.getSpeed(this.instance);
    }

    getLatitude() {
        return this.emitter.getLatitude(this.instance);
    }

    getLongitude() {
        return this.emitter.getLongitude(this.instance);
    }

    getLifeSpan() {
        return this.emitter.getLifeSpan(this.instance);
    }

    getGravity() {
        return this.emitter.getGravity(this.instance);
    }

    getEmissionRate() {
        return this.emitter.getEmissionRate(this.instance);
    }

    getVisibility() {
        return this.emitter.getVisibility(this.instance);
    }
};
