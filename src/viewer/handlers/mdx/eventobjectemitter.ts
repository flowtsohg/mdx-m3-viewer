import MdxModelInstance from './modelinstance';
import MdxEmitter from './emitter';
import EventObjectEmitterObject from './eventobjectemitterobject';

const valueHeap = new Uint32Array(1);

/**
 * The abstract base MDX event object emitter.
 */
export default abstract class EventObjectEmitter extends MdxEmitter {
  lastValue: number = 0;

  updateEmission(dt: number) {
    let instance = <MdxModelInstance>this.instance;

    if (instance.allowParticleSpawn) {
      let emitterObject = <EventObjectEmitterObject>this.emitterObject;

      emitterObject.getValue(valueHeap, instance);

      let value = valueHeap[0];

      if (value === 1 && value !== this.lastValue) {
        this.currentEmission += 1;
      }

      this.lastValue = value;
    }
  }

  emit() {
    this.emitObject();
  }
}
