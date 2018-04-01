import MdxSharedEmitter from './sharedemitter';
import MdxParticle from './particle';

export default class MdxParticleEmitter extends MdxSharedEmitter {
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
        return this.modelObject.getValue('KPES', instance, this.modelObject.speed);
    }

    getLatitude(instance) {
        return this.modelObject.getValue('KPLTV', instance, this.modelObject.latitude);
    }

    getLongitude(instance) {
        return this.modelObject.getValue('KPLN', instance, this.modelObject.longitude);
    }

    getLifeSpan(instance) {
        return this.modelObject.getValue('KPEL', instance, this.modelObject.lifeSpan);
    }

    getGravity(instance) {
        return this.modelObject.getValue('KPEG', instance, this.modelObject.gravity);
    }

    getEmissionRate(instance) {
        return this.modelObject.getValue('KPEE', instance, this.modelObject.emissionRate);
    }

    getVisibility(instance) {
        return this.modelObject.getValue('KPEV', instance, 1);
    }
};
