import Emitter from '../../emitter';
import Particle2 from './particle2';

// Heap allocations needed for this module.
const emissionRateHeap = new Float32Array(1);

/**
 * An MDX particle emitter type 2.
 */
export default class ParticleEmitter2 extends Emitter {
  /**
   * @param {ModelInstance} instance
   * @param {ParticleEmitter2Object} emitterObject
   */
  constructor(instance, emitterObject) {
    super(instance, emitterObject);

    /** @member {Node} */
    this.node = instance.nodes[emitterObject.index];
    /** @member {number} */
    this.lastEmissionKey = -1;
  }

  /**
   * @param {number} dt
   */
  updateEmission(dt) {
    if (this.instance.allowParticleSpawn) {
      let keyframe = this.emitterObject.getEmissionRate(emissionRateHeap, this.instance);

      if (this.emitterObject.squirt) {
        if (keyframe !== this.lastEmissionKey) {
          this.currentEmission += emissionRateHeap[0];
        }

        this.lastEmissionKey = keyframe;
      } else {
        this.currentEmission += emissionRateHeap[0] * dt;
      }
    }
  }

  /**
   *
   */
  emit() {
    if (this.emitterObject.head) {
      this.emitObject(0);
    }

    if (this.emitterObject.tail) {
      this.emitObject(1);
    }
  }

  /**
   * @return {Particle2}
   */
  createObject() {
    return new Particle2(this);
  }
}
