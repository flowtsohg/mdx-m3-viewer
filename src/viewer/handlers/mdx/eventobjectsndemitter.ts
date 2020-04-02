import EventObjectEmitter from './eventobjectemitter';
import EventObjectSnd from './eventobjectsnd';

/**
 * An MDX sound emitter.
 */
export default class EventObjectSndEmitter extends EventObjectEmitter {
  createObject(): EventObjectSnd {
    return new EventObjectSnd(this);
  }
}
