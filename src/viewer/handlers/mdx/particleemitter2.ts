import ParticleEmitter2Object from './particleemitter2object';
import MdxModelInstance from './modelinstance';
import MdxNode from './node';
import MdxEmitter from './emitter';
import Particle2 from './particle2';

const emissionRateHeap = new Float32Array(1);

/**
 * An MDX particle emitter type 2.
 */
export default class ParticleEmitter2 extends MdxEmitter {
  node: MdxNode;
  lastEmissionKey: number = -1;

  constructor(instance: MdxModelInstance, emitterObject: ParticleEmitter2Object) {
    super(instance, emitterObject);

    this.node = instance.nodes[emitterObject.index];
  }

  updateEmission(dt: number) {
    let instance = <MdxModelInstance>this.instance;

    if (instance.allowParticleSpawn) {
      let emitterObject = <ParticleEmitter2Object>this.emitterObject;
      let keyframe = emitterObject.getEmissionRate(emissionRateHeap, instance.sequence, instance.frame, instance.counter);

      if (emitterObject.squirt) {
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
    let emitterObject = <ParticleEmitter2Object>this.emitterObject;

    if (emitterObject.head) {
      this.emitObject(0);
    }

    if (emitterObject.tail) {
      this.emitObject(1);
    }
  }

  createObject(): Particle2 {
    return new Particle2(this);
  }
}
