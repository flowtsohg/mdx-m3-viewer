import SharedGeometryEmitter from './sharedgeometryemitter';
import EventObjectSpl from './eventobjectspl';

/**
 * An MDX splat emitter.
 */
export default class EventObjectSplEmitter extends SharedGeometryEmitter {
  /**
   * @param {EventObject} modelObject
   */
  constructor(modelObject) {
    super(modelObject);

    this.type = 'SPL';
    this.elementsPerEmit = 30;
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
   * @return {EventObjectSpl}
   */
  createObject() {
    return new EventObjectSpl(this);
  }
}
