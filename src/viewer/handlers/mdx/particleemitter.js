import Emitter from '../../emitter';
import Particle from './particle';

// Heap allocations needed for this module.
let emissionRateHeap = new Float32Array(1);

/**
 * An MDX particle emitter.
 */
export default class ParticleEmitter extends Emitter {
  /**
   * @param {number} dt
   */
  updateEmission(dt) {
    if (this.instance.allowParticleSpawn) {
      this.emitterObject.getEmissionRate(emissionRateHeap);

      this.currentEmission += emissionRateHeap[0] * dt;
    }
  }

  /**
   *
   */
  emit() {
    this.emitObject();
  }

  /**
   * @return {Particle}
   */
  createObject() {
    return new Particle(this);
  }
}
