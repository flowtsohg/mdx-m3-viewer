import { lua_newthread, lua_State } from 'fengari/src/lstate';
import JassTrigger from './types/trigger';
import JassTimer from './types/timer';
import JassUnit from './types/unit';

/**
 * A thread.
 */
export default class Thread {
  L: lua_State;
  sleep = 0;
  expiredTimer: JassTimer | null;
  triggerUnit: JassUnit | null;
  triggeringTrigger: JassTrigger | null;

  constructor(L: lua_State, data: { expiredTimer?: JassTimer, triggerUnit?: JassUnit, triggeringTrigger?: JassTrigger }) {
    this.L = lua_newthread(L);
    this.expiredTimer = data.expiredTimer || null;
    this.triggerUnit = data.triggerUnit || null;
    this.triggeringTrigger = data.triggeringTrigger || null;
  }
}
