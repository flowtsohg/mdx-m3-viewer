import Emitter from '../../emitter';
import { SkeletalNode } from '../../node';
import MdxComplexInstance from './complexinstance';
import Particle2 from './particle2';
import ParticleEmitter2Object from './particleemitter2object';

// Heap allocations needed for this module.
const emissionRateHeap = new Float32Array(1);

/**
 * An MDX particle emitter type 2.
 */
export default class ParticleEmitter2 extends Emitter {
  node: SkeletalNode;
  lastEmissionKey: number;

  constructor(instance: MdxComplexInstance, emitterObject: ParticleEmitter2Object) {
    super(instance, emitterObject);

    this.node = instance.nodes[emitterObject.index];
    this.lastEmissionKey = -1;
  }

  updateEmission(dt: number) {
    let instance = <MdxComplexInstance>this.instance;

    if (instance.allowParticleSpawn) {
      let keyframe = this.emitterObject.getEmissionRate(emissionRateHeap, instance);

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

  emit() {
    if (this.emitterObject.head) {
      this.emitObject(0);
    }

    if (this.emitterObject.tail) {
      this.emitObject(1);
    }
  }

  createObject() {
    return new Particle2(this);
  }
}
