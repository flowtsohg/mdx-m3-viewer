import SharedEmitter from './sharedemitter';
import EventObjectSnd from './eventobjectsnd';

/**
 * An MDX sound emitter.
 */
export default class EventObjectSndEmitter extends SharedEmitter {
  /**
   * @param {EventEmitter} modelObject
   */
  constructor(modelObject) {
    super(modelObject);

    this.type = 'SND';
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
   * @return {EventObjectSnd}
   */
  createObject() {
    return new EventObjectSnd(this);
  }

  /**
   * @param {EventObjectEmitterView} emitterView
   */
  emit(emitterView) {
    let eventEmitter = this.modelObject;

    if (eventEmitter.ready) {
      let viewer = eventEmitter.model.viewer;

      if (viewer.audioEnabled) {
        let scene = emitterView.instance.scene;
        let audioContext = scene.audioContext;

        if (audioContext && audioContext.state === 'running') {
          this.emitObject(emitterView);
        }
      }
    }
  }
}
