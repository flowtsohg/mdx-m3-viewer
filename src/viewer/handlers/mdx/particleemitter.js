import Emitter from './emitter';
import Particle from './particle';

/**
 * An MDX particle emitter.
 */
export default class ParticleEmitter extends Emitter {
  /**
   * @param {ParticleEmitterView} emitterView
   */
  emit(emitterView) {
    this.emitObject(emitterView);
  }

  /**
   * @return {Particle}
   */
  createObject() {
    return new Particle(this);
  }
}
