import {lua_newthread} from 'fengari/src/lua';

/**
 * A thread.
 */
export default class Thread {
  /**
   * @param {lua_State} L
   * @param {Object} data
   */
  constructor(L, data) {
    /** @member {lua_State} */
    this.L = lua_newthread(L);
    /** @member {number} */
    this.sleep = 0;
    /** @member {?Handle} */
    this.expiredTimer = data.expiredTimer || null;
    /** @member {?Handle} */
    this.triggerUnit = data.triggerUnit || null;
    /** @member {?Trigger} */
    this.trigger = data.trigger || null;
  }
}
