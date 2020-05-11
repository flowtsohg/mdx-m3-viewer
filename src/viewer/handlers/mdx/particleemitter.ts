import ParticleEmitterObject from './particleemitterobject';
import MdxModelInstance from './modelinstance';
import MdxEmitter from './emitter';
import Particle from './particle';

const emissionRateHeap = new Float32Array(1);

/**
 * An MDX particle emitter.
 */
export default class ParticleEmitter extends MdxEmitter {
  updateEmission(dt: number) {
    let instance = <MdxModelInstance>this.instance;

    if (instance.allowParticleSpawn) {
      let emitterObject = <ParticleEmitterObject>this.emitterObject;

      emitterObject.getEmissionRate(emissionRateHeap, instance.sequence, instance.frame, instance.counter);

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
