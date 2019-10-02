import Emitter from './emitter';
import EventObjectSpn from './eventobjectspn';

/**
 * An MDX model emitter.
 */
export default class EventObjectSpnEmitter extends Emitter {
  /**
   * @param {EventObjectEmitterView} emitterView
   */
  emit(emitterView) {
    if (this.modelObject.ok) {
      this.emitObject(emitterView);
    }
  }

  /**
   * @return {EventObjectSpn}
   */
  createObject() {
    return new EventObjectSpn(this);
  }
}
