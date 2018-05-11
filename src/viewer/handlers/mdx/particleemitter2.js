import SharedGeometryEmitter from './sharedgeometryemitter';
import Particle2 from './particle2';

export default class ParticleEmitter2 extends SharedGeometryEmitter {
    constructor(modelObject) {
        super(modelObject);

        this.bytesPerEmit = ((modelObject.headOrTail === 2) ? 2 : 1) * 4 * 30;
    }

    emit(emitterView) {
        if (this.modelObject.head) {
            this.emitObject(emitterView, true);
        }

        if (this.modelObject.tail) {
            this.emitObject(emitterView, false);
        }
    }

    createObject() {
        return new Particle2(this);
    }
};
