
import { EventEmitter } from 'events';
import { lua_State } from 'fengari/src/lstate';
import { lua_atnativeerror, lua_getglobal, lua_pcall, lua_pop, lua_pushstring, lua_rawgeti, lua_touserdata } from 'fengari/src/lapi';
import { LUA_REGISTRYINDEX, thread_status, to_jsstring, to_luastring } from 'fengari/src/defs';
import { luaL_checknumber, luaL_loadstring, luaL_newstate, luaL_tolstring } from 'fengari/src/lauxlib';
import { lua_resume } from 'fengari/src/ldo';
import War3Map from '../../parsers/w3x/map';
import jass2lua from './jass2lua';
import bindNatives from './natives';
import JassPlayer from './types/player';
import constantHandles from './constanthandles';
import Thread from './thread';
import JassHandle from './types/handle';
import JassLocation from './types/location';
import JassTimer from './types/timer';
import { JassTrigger } from './types/index';

/**
 * A Jass2 context.
 */
export default class Context extends EventEmitter {
  L: lua_State;
  map: War3Map | null = null;
  handle = 0;
  freeHandles: number[] = [];
  handles: (JassHandle | null)[] = [];
  name = '';
  description = '';
  players: JassPlayer[] = [];
  actualPlayers = 0;
  startLocations: JassLocation[] = [];
  constantHandles = constantHandles();
  timers: Set<JassTimer> = new Set();
  triggers: Set<JassTrigger> = new Set();
  threads: Set<Thread> = new Set();
  currentThread: Thread | null = null;
  enumUnit: JassHandle | null = null;
  filterUnit: JassHandle | null = null;
  enumPlayer: JassHandle | null = null;
  t = 0;

  constructor() {
    super();

    this.L = luaL_newstate();

    //luaL_openlibs(this.L);

    bindNatives(this);

    lua_atnativeerror(this.L, (L: lua_State) => {
      const e = <Error>lua_touserdata(L, -1);

      lua_pushstring(L, e.stack || 'An unknown error occured');

      return 1;
    });

    for (let i = 0; i < 28; i++) {
      this.players[i] = <JassPlayer>this.addHandle(new JassPlayer(i, 28));
    }

    // this.mappedData = new MappedData();

    // this.mapName = '';
    // this.mapDescription = '';
    // this.gamePlacement = null;
    // this.gameSpeed = null;
    // this.gameDifficulty = null;
    // this.playerCount = 0;
    // this.teamCount = 0;
    // this.startLocations = [];
    // this.players = [];
    // this.teams = [];

    // this.stringTable = map.readStringTable();
  }

  start(): void {
    this.t = performance.now();
  }

  step(): void {
    const t = performance.now();
    const dt = (t - this.t) * 0.001;
    const timers = this.timers;
    const threads = this.threads;

    for (const timer of timers) {
      timer.elapsed += dt;

      if (timer.elapsed >= timer.timeout) {
        const thread = new Thread(this.L, { expiredTimer: timer });
        const L = thread.L;

        // Push the entry point onto the thread's stack, so when the thread is resumed it will immediately be called.
        lua_rawgeti(L, LUA_REGISTRYINDEX, timer.handlerFunc);

        this.threads.add(thread);

        if (timer.periodic) {
          timer.elapsed = 0;
        } else {
          timers.delete(timer);

          /// TODO: better way to clean references.
          // If the timer isn't periodic, the callback reference can be collected.
          ///luaL_unref(timer.handlerFunc);
        }
      }
    }

    for (const thread of threads) {
      thread.sleep -= dt;

      if (thread.sleep <= 0) {
        this.currentThread = thread;

        const L = thread.L;
        const status = lua_resume(L, this.L, 0);

        if (status === thread_status.LUA_OK) {
          threads.delete(thread);
        } else if (status === thread_status.LUA_YIELD) {
          thread.sleep = luaL_checknumber(L, 1);
        } else {
          console.log('[JS] Something went wrong during execution');
          console.log(to_jsstring(luaL_tolstring(L, -1)));
          lua_pop(L, 2);
        }
      }
    }

    this.t = t;
  }

  addHandle(handle: JassHandle): JassHandle {
    if (handle.handleId === -1) {
      let handleId;

      if (this.freeHandles.length) {
        handleId = <number>this.freeHandles.pop();
      } else {
        handleId = this.handle++;
      }

      this.handles[handleId] = handle;

      handle.handleId = handleId;
    }

    return handle;
  }

  freeHandle(handle: JassHandle): void {
    if (handle.handleId !== -1) {
      this.freeHandles.push(handle.handleId);

      this.handles[handle.handleId] = null;

      handle.handleId = -1;
    }
  }

  call(name?: string | number): void {
    const L = this.L;

    if (typeof name === 'string') {
      lua_getglobal(L, name);
    } else if (typeof name === 'number') {
      lua_rawgeti(L, LUA_REGISTRYINDEX, name);
    }

    if (lua_pcall(L, 0, 0, 0)) {
      console.log('Something went wrong during execution');
      console.log(to_jsstring(luaL_tolstring(L, -1)));
      lua_pop(L, 2);
    }
  }

  run(code: string, isJass: boolean): void {
    const L = this.L;

    if (isJass) {
      code = jass2lua(code);
    }

    if (luaL_loadstring(L, to_luastring(code))) {
      console.log('Something went wrong during execution');
      console.log(to_jsstring(luaL_tolstring(L, -1)));
      lua_pop(L, 2);
    }

    if (lua_pcall(L, 0, 0, 0)) {
      console.log('Something went wrong during execution');
      console.log(to_jsstring(luaL_tolstring(L, -1)));
      lua_pop(L, 2);
    }
  }

  open(map: War3Map): void {
    this.map = map;

    const file = map.getScriptFile();

    if (file) {
      const buffer = file.text();

      if (buffer) {
        const isJass = file.name.endsWith('.j');

        this.run(buffer, isJass);
      }
    }
  }
}
