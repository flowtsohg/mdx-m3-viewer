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

    /** @member {number} */
    this.baseIndex = 0;
    /** @member {number} */
    this.currentIndex = 0;
    /** @member {?Ribbon} */
    this.currentRibbon = null;
  }

  /**
   * @param {number} dt
   */
  updateEmission(dt) {
    if (this.instance.allowParticleSpawn) {
      this.currentEmission += this.emitterObject.emissionRate * dt;
    }
  }

  /**
   *
   */
  emit() {
    this.currentRibbon = this.emitObject();
  }

  /**
   * @return {Ribbon}
   */
  createObject() {
    return new Ribbon(this);
  }
}
