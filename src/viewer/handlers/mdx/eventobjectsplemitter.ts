import EventObjectEmitter from './eventobjectemitter';
import EventObjectSplUbr from './eventobjectsplubr';

/**
 * An MDX splat emitter.
 */
export default class EventObjectSplEmitter extends EventObjectEmitter {
  createObject() {
    return new EventObjectSplUbr(this);
  }
}
