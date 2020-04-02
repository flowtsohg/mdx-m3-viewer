
import { EventEmitter } from 'events';
// @ts-ignore
import { to_luastring, to_jsstring } from 'fengari/src/fengaricore';
// @ts-ignore
import { lua_State, lua_pop, lua_getglobal, lua_pcall, lua_atnativeerror, lua_pushstring, lua_touserdata, lua_rawgeti, LUA_REGISTRYINDEX, lua_resume, LUA_OK, LUA_YIELD } from 'fengari/src/lua';
// @ts-ignore
import { luaL_newstate, luaL_loadstring, luaL_tolstring, luaL_unref, luaL_checknumber } from 'fengari/src/lauxlib';
//import { luaL_openlibs } from 'fengari/src/lualib';
import jass2lua from './jass2lua';
import bindNatives from './natives';
import JassPlayer from './types/player';
import constantHandles from './constanthandles';
import Thread from './thread';
import War3Map from '../../parsers/w3x/map';
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
  handle: number = 0;
  freeHandles: number[] = [];
  handles: (JassHandle | null)[] = [];
  name: string = '';
  description: string = '';
  players: JassPlayer[] = [];
  actualPlayers: number = 0;
  startLocations: JassLocation[] = [];
  constantHandles = constantHandles();
  timers: Set<JassTimer> = new Set();
  triggers: Set<JassTrigger> = new Set();
  threads: Set<Thread> = new Set();
  currentThread: Thread | null = null;
  enumUnit: JassHandle | null = null;
  filterUnit: JassHandle | null = null;
  enumPlayer: JassHandle | null = null;
  t: number = 0;

  constructor() {
    super();

    this.L = luaL_newstate();

    //luaL_openlibs(this.L);

    bindNatives(this);

    lua_atnativeerror(this.L, (L: lua_State) => {
      let e = lua_touserdata(L, -1);

      lua_pushstring(L, e.stack);

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

  start() {
    this.t = performance.now();
  }

  step() {
    let t = performance.now();
    let dt = (t - this.t) * 0.001;
    let timers = this.timers;
    let threads = this.threads;

    for (let timer of timers) {
      timer.elapsed += dt;

      if (timer.elapsed >= timer.timeout) {
        let thread = new Thread(this.L, { expiredTimer: timer });
        let L = thread.L;

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

    for (let thread of threads) {
      thread.sleep -= dt;

      if (thread.sleep <= 0) {
        this.currentThread = thread;

        let L = thread.L;
        let status = lua_resume(L, this.L, 0);

        if (status === LUA_OK) {
          threads.delete(thread);
        } else if (status === LUA_YIELD) {
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

  addHandle(handle: JassHandle) {
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

  freeHandle(handle: JassHandle) {
    if (handle.handleId !== -1) {
      this.freeHandles.push(handle.handleId);

      this.handles[handle.handleId] = null;

      handle.handleId = -1;
    }
  }

  call(name?: string | number) {
    let L = this.L;

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

  run(code: string, isJass: boolean) {
    let L = this.L;

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

  open(map: War3Map) {
    this.map = map;

    let file = map.getScriptFile();

    if (file) {
      let buffer = file.text();

      if (buffer) {
        let isJass = file.name.endsWith('.j');

        this.run(buffer, isJass);
      }
    }
  }
}
