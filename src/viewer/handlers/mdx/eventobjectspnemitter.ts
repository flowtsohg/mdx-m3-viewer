import EventObjectEmitter from './eventobjectemitter';
import EventObjectSpn from './eventobjectspn';

/**
 * An MDX model emitter.
 */
export default class EventObjectSpnEmitter extends EventObjectEmitter {
  createObject() {
    return new EventObjectSpn(this);
  }
}
