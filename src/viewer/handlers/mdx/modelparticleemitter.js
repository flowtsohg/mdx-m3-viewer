import GenericObject from './genericobject';

export default class ParticleEmitter extends GenericObject {
    /**
     * @param {MdxModel} model
     * @param {MdxParserParticleEmitter} emitter
     */
    constructor(model, emitter, pivotPoints, index) {
        super(model, emitter, pivotPoints, index);

        this.internalResource = model.viewer.load(emitter.path.replace(/\\/g, '/').toLowerCase().replace('.mdl', '.mdx'), model.pathSolver);
        this.speed = emitter.speed;
        this.latitude = emitter.latitude;
        this.longitude = emitter.longitude;
        this.lifeSpan = emitter.lifeSpan;
        this.gravity = emitter.gravity;
        this.emissionRate = emitter.emissionRate;
    }

    getSpeed(instance) {
        return this.getValue('KPES', instance, this.speed);
    }

    getLatitude(instance) {
        return this.getValue('KPLTV', instance, this.latitude);
    }

    getLongitude(instance) {
        return this.getValue('KPLN', instance, this.longitude);
    }

    getLifeSpan(instance) {
        return this.getValue('KPEL', instance, this.lifeSpan);
    }

    getGravity(instance) {
        return this.getValue('KPEG', instance, this.gravity);
    }

    getEmissionRate(instance) {
        return this.getValue('KPEE', instance, this.emissionRate);
    }

    getVisibility(instance) {
        return this.getValue('KPEV', instance, 1);
    }
};
