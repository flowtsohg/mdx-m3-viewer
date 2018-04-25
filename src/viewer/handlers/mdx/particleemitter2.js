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

    fill(emitterView, scene) {
        let emission = emitterView.currentEmission;

        if (emission >= 1) {
            for (let i = 0, l = Math.floor(emission); i < l; i++ , emitterView.currentEmission--) {
                this.emit(emitterView);
            }
        }
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
};
