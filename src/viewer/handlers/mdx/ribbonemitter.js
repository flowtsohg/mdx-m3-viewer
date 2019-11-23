import Emitter from '../../emitter';
import Ribbon from './ribbon';

/**
 * A ribbon emitter.
 */
export default class RibbonEmitter extends Emitter {
  /**
   * @param {ModelInstance} instance
   * @param {RibbonEmitterObject} emitterObject
   */
  constructor(instance, emitterObject) {
    super(instance, emitterObject);

    /** @member {?Ribbon} */
    this.first = null;
    /** @member {?Ribbon} */
    this.last = null;
  }

  /**
   * @param {number} dt
   */
  updateEmission(dt) {
    if (this.instance.allowParticleSpawn) {
      // It doesn't make sense to emit more than 1 ribbon at the same time.
      this.currentEmission = Math.min(this.currentEmission + this.emitterObject.emissionRate * dt, 1);
    }
  }

  /**
   *
   */
  emit() {
    let ribbon = this.emitObject();
    let last = this.last;

    if (last) {
      last.next = ribbon;
      ribbon.prev = last;
    } else {
      this.first = ribbon;
    }

    this.last = ribbon;
  }

  /**
   * @override
   * @param {Ribbon} object
   */
  kill(object) {
    super.kill(object);

    let prev = object.prev;
    let next = object.next;

    if (object === this.first) {
      this.first = next;
    }

    if (object === this.last) {
      this.first = null;
      this.last = null;
    }

    if (prev) {
      prev.next = next;
    }

    if (next) {
      next.prev = prev;
    }

    object.prev = null;
    object.next = null;
  }

  /**
   * @return {Ribbon}
   */
  createObject() {
    return new Ribbon(this);
  }
}
