import ResizeableBuffer from '../../gl/resizeablebuffer';
import MdxSharedGeometryEmitter from './sharedgeometryemitter';
import MdxParticle2 from './particle2';

export default class MdxParticleEmitter2 extends MdxSharedGeometryEmitter {
    /**
     * @param {MdxModelParticleEmitter2} modelObject
     */
    constructor(modelObject) {
        super(modelObject);

        this.bytesPerEmit = ((modelObject.headOrTail === 2) ? 2 : 1) * 4 * 30;
        this.buffer = new ResizeableBuffer(modelObject.model.env.gl);
    }

    emitParticle(emitterView, isHead) {
        this.buffer.grow((this.active.length + 1) * this.bytesPerEmit);

        let inactive = this.inactive,
            object;

        if (inactive.length) {
            object = inactive.pop();
        } else {
            object = new MdxParticle2(this);
        }

        object.reset(emitterView, isHead);

        this.active.push(object);
    }

    emit(emitterView) {
        if (this.modelObject.head) {
            this.emitParticle(emitterView, true);
        }

        if (this.modelObject.tail) {
            this.emitParticle(emitterView, false);
        }
    }

    shouldRender(instance) {
        return this.getVisibility(instance) > 0.75;
    }

    getWidth(instance) {
        return this.modelObject.getValue('KP2W', instance, this.modelObject.width);
    }

    getLength(instance) {
        return this.modelObject.getValue('KP2N', instance, this.modelObject.length);
    }

    getSpeed(instance) {
        return this.modelObject.getValue('KP2S', instance, this.modelObject.speed);
    }

    getLatitude(instance) {
        return this.modelObject.getValue('KP2L', instance, this.modelObject.latitude);
    }

    getGravity(instance) {
        return this.modelObject.getValue('KP2G', instance, this.modelObject.gravity);
    }

    getEmissionRate(instance) {
        return this.modelObject.getValue('KP2E', instance, this.modelObject.emissionRate);
    }

    getEmissionRateKeyframe(instance) {
        return this.modelObject.getKeyframe('KP2E', instance);
    }

    getVisibility(instance) {
        return this.modelObject.getValue('KP2V', instance, 1);
    }

    getVariation(instance) {
        return this.modelObject.getValue('KP2R', instance, this.modelObject.variation);
    }
};
