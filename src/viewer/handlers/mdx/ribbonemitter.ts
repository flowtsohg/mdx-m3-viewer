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

  updateEmission(dt: number): void {
    const instance = <MdxModelInstance>this.instance;

    if (instance.allowParticleSpawn) {
      const emitterObject = <RibbonEmitterObject>this.emitterObject;

      // It doesn't make sense to emit more than 1 ribbon at the same time.
      this.currentEmission += emitterObject.emissionRate * dt;
    }
  }

  emit(): void {
    const ribbon = <Ribbon>this.emitObject();
    const last = this.last;

    if (last) {
      last.next = ribbon;
      ribbon.prev = last;
    } else {
      this.first = ribbon;
    }

    this.last = ribbon;
  }

  override kill(object: Ribbon): void {
    super.kill(object);

    const prev = object.prev;
    const next = object.next;

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
