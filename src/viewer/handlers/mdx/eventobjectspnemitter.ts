import EventObjectEmitter from './eventobjectemitter';
import EventObjectSpn from './eventobjectspn';

/**
 * An MDX model emitter.
 */
export default class EventObjectSpnEmitter extends EventObjectEmitter {
  createObject(): EventObjectSpn {
    return new EventObjectSpn(this);
  }
}
