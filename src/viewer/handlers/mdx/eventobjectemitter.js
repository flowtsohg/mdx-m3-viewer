import Emitter from '../../emitter';

// Heap allocations needed for this module.
const valueHeap = new Uint8Array(1);

/**
 * The abstract base MDX event object emitter.
 */
export default class EventObjectEmitter extends Emitter {
  /**
   * @param {ModelInstance} instance
   * @param {EventObjectEmitterObject} emitterObject
   */
  constructor(instance, emitterObject) {
    super(instance, emitterObject);

    this.lastValue = 0;
  }

  /**
   * @param {number} dt
   */
  updateEmission(dt) {
    if (this.instance.allowParticleSpawn) {
      this.emitterObject.getValue(valueHeap, this.instance);

      let value = valueHeap[0];

      if (value === 1 && value !== this.lastValue) {
        this.currentEmission += 1;
      }

      this.lastValue = value;
    }
  }

  /**
   *
   */
  emit() {
    if (this.emitterObject.ok) {
      this.emitObject();
    }
  }
}
