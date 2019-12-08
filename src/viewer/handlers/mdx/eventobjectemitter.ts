import Emitter from '../../emitter';
import MdxComplexInstance from './complexinstance';
import EventObjectEmitterObject from './eventobjectemitterobject';

// Heap allocations needed for this module.
const valueHeap = new Uint8Array(1);

/**
 * The abstract base MDX event object emitter.
 */
export default abstract class EventObjectEmitter extends Emitter {
  lastValue: number;

  constructor(instance: MdxComplexInstance, emitterObject: EventObjectEmitterObject) {
    super(instance, emitterObject);

    this.lastValue = 0;
  }

  updateEmission(dt: number) {
    let instance = <MdxComplexInstance>this.instance;

    if (instance.allowParticleSpawn) {
      this.emitterObject.getValue(valueHeap, instance);

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
