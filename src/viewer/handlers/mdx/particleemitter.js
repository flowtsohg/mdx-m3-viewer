import MdxSharedEmitter from './sharedemitter';
import MdxParticle from './particle';

export default class MdxParticleEmitter extends MdxSharedEmitter {
    /**
     * @param {MdxModelParticleEmitter} modelObject
     */
    constructor(modelObject) {
        super(modelObject);
        
        this.active = [];
        this.inactive = [];
    }

    emit(emitterView) {
        let inactive = this.inactive,
            object;

        if (inactive.length) {
            object = inactive.pop();
        } else {
            object = new MdxParticle(this);
        }

        object.reset(emitterView);

        this.active.push(object);
    }
    
    shouldRender(instance) {
        return this.getVisibility(instance) > 0.75;
    }

    getSpeed(instance) {
        return this.modelObject.sd.getValue('KPES', instance, this.modelObject.speed);
    }

    getLatitude(instance) {
        return this.modelObject.sd.getValue('KPLTV', instance, this.modelObject.latitude);
    }

    getLongitude(instance) {
        return this.modelObject.sd.getValue('KPLN', instance, this.modelObject.longitude);
    }

    getLifespan(instance) {
        return this.modelObject.sd.getValue('KPEL', instance, this.modelObject.lifespan);
    }

    getGravity(instance) {
        return this.modelObject.sd.getValue('KPEG', instance, this.modelObject.gravity);
    }

    getEmissionRate(instance) {
        return this.modelObject.sd.getValue('KPEE', instance, this.modelObject.emissionRate);
    }

    getVisibility(instance) {
        return this.modelObject.sd.getValue('KPEV', instance, 1);
    }
};
