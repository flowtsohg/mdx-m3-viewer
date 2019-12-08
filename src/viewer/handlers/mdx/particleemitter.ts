import MdxComplexInstance from './complexinstance';
import Emitter from '../../emitter';
import Particle from './particle';

// Heap allocations needed for this module.
const emissionRateHeap = new Float32Array(1);

/**
 * An MDX particle emitter.
 */
export default class ParticleEmitter extends Emitter {
  updateEmission(dt: number) {
    let instance = <MdxComplexInstance>this.instance;

    if (instance.allowParticleSpawn) {
      this.emitterObject.getEmissionRate(emissionRateHeap);

      this.currentEmission += emissionRateHeap[0] * dt;
    }
  }

  emit() {
    this.emitObject();
  }

  createObject() {
    return new Particle(this);
  }
}
