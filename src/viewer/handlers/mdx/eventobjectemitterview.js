// Heap allocations needed for this module.
let valueHeap = new Uint32Array(1);

/**
 * An event object emitter view.
 */
export default class EventObjectEmitterView {
  /**
   * @param {ModelInstance} instance
   * @param {EventObjectEmitter} emitter
   */
  constructor(instance, emitter) {
    this.instance = instance;
    this.emitter = emitter;
    this.lastValue = 0;
    this.currentEmission = 0;
  }

  /**
   *
   */
  reset() {
    this.lastValue = 0;
  }

  /**
   *
   */
  update() {
    if (this.instance.allowParticleSpawn) {
      this.emitter.getValue(valueHeap, this.instance);

      let value = valueHeap[0];

      if (value === 1 && value !== this.lastValue) {
        this.currentEmission += 1;
      }

      this.lastValue = value;
    }
  }
}
