import {lua_newthread} from 'fengari/src/lua';

/**
 * A thread.
 */
class Thread {
  /**
   * @param {lua_State} L
   * @param {Object} data
   */
  constructor(L, data) {
    this.L = lua_newthread(L);
    this.data = {...data};
  }
}

/**
 * A thread that waits for a timeout.
 */
export class WaitingThread extends Thread {
  /**
   * @param {lua_State} L
   * @param {Object} data
   * @param {number} timeout
   */
  constructor(L, data, timeout) {
    super(L, data);

    this.timeout = timeout;
  }
}
