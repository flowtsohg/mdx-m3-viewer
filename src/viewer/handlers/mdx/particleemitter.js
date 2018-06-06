import SharedEmitter from './sharedemitter';
import Particle from './particle';

/**
 * An MDX particle emitter.
 */
export default class ParticleEmitter extends SharedEmitter {
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
