import EventObjectEmitter from './eventobjectemitter';
import EventObjectSplUbr from './eventobjectsplubr';

/**
 * An MDX ubersplat emitter.
 */
export default class EventObjectUbrEmitter extends EventObjectEmitter {
  /**
   * @return {EventObjectSplUbr}
   */
  createObject() {
    return new EventObjectSplUbr(this);
  }
}
