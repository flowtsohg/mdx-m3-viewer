import SharedEmitter from './sharedemitter';
import Particle from './particle';

export default class ParticleEmitter extends SharedEmitter {
    emit(emitterView) {
        this.emitObject(emitterView);
    }

    createObject() {
        return new Particle(this);
    }
};
