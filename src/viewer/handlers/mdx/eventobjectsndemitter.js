import EventObjectEmitter from './eventobjectemitter';
import EventObjectSnd from './eventobjectsnd';

/**
 * An MDX sound emitter.
 */
export default class EventObjectSndEmitter extends EventObjectEmitter {
  /**
   * @return {EventObjectSnd}
   */
  createObject() {
    return new EventObjectSnd(this);
  }
}
