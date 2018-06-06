import SharedGeometryEmitter from './sharedgeometryemitter';
import EventObjectUbr from './eventobjectubr';

/**
 * An MDX ubersplat emitter.
 */
export default class EventObjectUbrEmitter extends SharedGeometryEmitter {
  /**
   * @param {EventObject} modelObject
   */
  constructor(modelObject) {
    super(modelObject);

    this.type = 'UBR';
    this.bytesPerEmit = 4 * 30;
  }

  /**
   * @param {EventObjectEmitterView} emitterView
   */
  emit(emitterView) {
    if (this.modelObject.ready) {
      this.emitObject(emitterView);
    }
  }

  /**
   * @return {EventObjectUbr}
   */
  createObject() {
    return new EventObjectUbr(this);
  }
}
