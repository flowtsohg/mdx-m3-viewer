import SharedEmitter from './sharedemitter';
import EventObjectSpn from './eventobjectspn';

/**
 * An MDX model emitter.
 */
export default class EventObjectSpnEmitter extends SharedEmitter {
  /**
   * @param {EventObject} modelObject
   */
  constructor(modelObject) {
    super(modelObject);

    this.type = 'SPN';
  }

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
