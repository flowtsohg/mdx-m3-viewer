import EventObjectEmitter from './eventobjectemitter';
import EventObjectSplUbr from './eventobjectsplubr';

/**
 * An MDX splat emitter.
 */
export default class EventObjectSplEmitter extends EventObjectEmitter {
  /**
   * @return {EventObjectSplUbr}
   */
  createObject() {
    return new EventObjectSplUbr(this);
  }
}
