import RibbonEmitterObject from './ribbonemitterobject';
import MdxModelInstance from './modelinstance';
import MdxEmitter from './emitter';
import Ribbon from './ribbon';

/**
 * A ribbon emitter.
 */
export default class RibbonEmitter extends MdxEmitter {
  first: Ribbon | null = null;
  last: Ribbon | null = null;

  updateEmission(dt: number) {
    let instance = <MdxModelInstance>this.instance;

    if (instance.allowParticleSpawn) {
      let emitterObject = <RibbonEmitterObject>this.emitterObject;

      // It doesn't make sense to emit more than 1 ribbon at the same time.
      this.currentEmission = Math.min(this.currentEmission + emitterObject.emissionRate * dt, 1);
    }
  }

  emit() {
    let ribbon = <Ribbon>this.emitObject();
    let last = this.last;

    if (last) {
      last.next = ribbon;
      ribbon.prev = last;
    } else {
      this.first = ribbon;
    }

    this.last = ribbon;
  }

  kill(object: Ribbon) {
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

  createObject(): Ribbon {
    return new Ribbon(this);
  }
}
