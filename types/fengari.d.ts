declare module 'fengari/src/lstate' {
  export class lua_State {}
  // module.exports.CallInfo        = CallInfo;
  // module.exports.CIST_OAH        = (1<<0);  /* original value of 'allowhook' */
  // module.exports.CIST_LUA        = (1<<1);  /* call is running a Lua function */
  // module.exports.CIST_HOOKED     = (1<<2);  /* call is running a debug hook */
  // module.exports.CIST_FRESH      = (1<<3);  /* call is running on a fresh invocation of luaV_execute */
  // module.exports.CIST_YPCALL     = (1<<4);  /* call is a yieldable protected call */
  // module.exports.CIST_TAIL       = (1<<5);  /* call was tail called */
  // module.exports.CIST_HOOKYIELD  = (1<<6);  /* last hook called yielded */
  // module.exports.CIST_LEQ        = (1<<7);  /* using __lt for __le */
  // module.exports.CIST_FIN        = (1<<8);   /* call is running a finalizer */
  // module.exports.EXTRA_STACK     = EXTRA_STACK;
  // module.exports.lua_close       = lua_close;
  // module.exports.lua_newstate    = lua_newstate;
  const lua_newthread: (L: lua_State) => lua_State;
  // module.exports.luaE_extendCI   = luaE_extendCI;
  // module.exports.luaE_freeCI     = luaE_freeCI;
  // module.exports.luaE_freethread = luaE_freethread;
}

declare module 'fengari/src/lauxlib' {
  import { lua_State } from 'fengari/src/lstate';

  // module.exports.LUA_ERRFILE = LUA_ERRFILE;
  // module.exports.LUA_FILEHANDLE = LUA_FILEHANDLE;
  // module.exports.LUA_LOADED_TABLE = LUA_LOADED_TABLE;
  // module.exports.LUA_NOREF = LUA_NOREF;
  // module.exports.LUA_PRELOAD_TABLE = LUA_PRELOAD_TABLE;
  // module.exports.LUA_REFNIL = LUA_REFNIL;
  // module.exports.luaL_Buffer = luaL_Buffer;
  // module.exports.luaL_addchar = luaL_addchar;
  // module.exports.luaL_addlstring = luaL_addlstring;
  // module.exports.luaL_addsize = luaL_addsize;
  // module.exports.luaL_addstring = luaL_addstring;
  // module.exports.luaL_addvalue = luaL_addvalue;
  // module.exports.luaL_argcheck = luaL_argcheck;
  // module.exports.luaL_argerror = luaL_argerror;
  // module.exports.luaL_buffinit = luaL_buffinit;
  // module.exports.luaL_buffinitsize = luaL_buffinitsize;
  // module.exports.luaL_callmeta = luaL_callmeta;
  // module.exports.luaL_checkany = luaL_checkany;
  const luaL_checkinteger: (L: lua_State, arg: number) => number;
  const luaL_checklstring: (L: lua_State, arg: number) => string;
  const luaL_checknumber: (L: lua_State, arg: number) => number;
  // module.exports.luaL_checkoption = luaL_checkoption;
  // module.exports.luaL_checkstack = luaL_checkstack;
  const luaL_checkstring: (L: lua_State, arg: number) => string;
  // module.exports.luaL_checktype = luaL_checktype;
  // module.exports.luaL_checkudata = luaL_checkudata;
  // module.exports.luaL_checkversion = luaL_checkversion;
  // module.exports.luaL_checkversion_ = luaL_checkversion_;
  // module.exports.luaL_dofile = luaL_dofile;
  // module.exports.luaL_dostring = luaL_dostring;
  // module.exports.luaL_error = luaL_error;
  // module.exports.luaL_execresult = luaL_execresult;
  // module.exports.luaL_fileresult = luaL_fileresult;
  // module.exports.luaL_getmetafield = luaL_getmetafield;
  // module.exports.luaL_getmetatable = luaL_getmetatable;
  // module.exports.luaL_getsubtable = luaL_getsubtable;
  // module.exports.luaL_gsub = luaL_gsub;
  // module.exports.luaL_len = luaL_len;
  // module.exports.luaL_loadbuffer = luaL_loadbuffer;
  // module.exports.luaL_loadbufferx = luaL_loadbufferx;
  // module.exports.luaL_loadfile = luaL_loadfile;
  // module.exports.luaL_loadfilex = luaL_loadfilex;
  const luaL_loadstring: (L: lua_State, s: Uint8Array) => string;
  // module.exports.luaL_newlib = luaL_newlib;
  // module.exports.luaL_newlibtable = luaL_newlibtable;
  // module.exports.luaL_newmetatable = luaL_newmetatable;
  const luaL_newstate: () => lua_State;
  // module.exports.luaL_opt = luaL_opt;
  // module.exports.luaL_optinteger = luaL_optinteger;
  // module.exports.luaL_optlstring = luaL_optlstring;
  // module.exports.luaL_optnumber = luaL_optnumber;
  // module.exports.luaL_optstring = luaL_optstring;
  // module.exports.luaL_prepbuffer = luaL_prepbuffer;
  // module.exports.luaL_prepbuffsize = luaL_prepbuffsize;
  // module.exports.luaL_pushresult = luaL_pushresult;
  // module.exports.luaL_pushresultsize = luaL_pushresultsize;
  const luaL_ref: (L: lua_State, t: number) => number;
  // module.exports.luaL_requiref = luaL_requiref;
  // module.exports.luaL_setfuncs = luaL_setfuncs;
  // module.exports.luaL_setmetatable = luaL_setmetatable;
  // module.exports.luaL_testudata = luaL_testudata;
  const luaL_tolstring: (L: lua_State, idx: number) => Uint8Array;
  // module.exports.luaL_traceback = luaL_traceback;
  // module.exports.luaL_typename = luaL_typename;
  const luaL_unref: (L: lua_State, t: number, ref: number) => void;
  // module.exports.luaL_where = luaL_where;
  // module.exports.lua_writestringerror = lua_writestringerror;
}

declare module 'fengari/src/lapi' {
  import { lua_State } from 'fengari/src/lstate';

  // module.exports.api_incr_top          = api_incr_top;
  // module.exports.api_checknelems       = api_checknelems;
  // module.exports.lua_absindex          = lua_absindex;
  // module.exports.lua_arith             = lua_arith;
  // module.exports.lua_atpanic           = lua_atpanic;
  const lua_atnativeerror: (L: lua_State, errorf: (L: lua_State) => number) => void;
  // module.exports.lua_call              = lua_call;
  // module.exports.lua_callk             = lua_callk;
  // module.exports.lua_checkstack        = lua_checkstack;
  // module.exports.lua_compare           = lua_compare;
  // module.exports.lua_concat            = lua_concat;
  // module.exports.lua_copy              = lua_copy;
  // module.exports.lua_createtable       = lua_createtable;
  // module.exports.lua_dump              = lua_dump;
  // module.exports.lua_error             = lua_error;
  // module.exports.lua_gc                = lua_gc;
  // module.exports.lua_getallocf         = lua_getallocf;
  // module.exports.lua_getextraspace     = lua_getextraspace;
  // module.exports.lua_getfield          = lua_getfield;
  const lua_getglobal: (L: lua_State, name: string) => unknown;
  // module.exports.lua_geti              = lua_geti;
  // module.exports.lua_getmetatable      = lua_getmetatable;
  // module.exports.lua_gettable          = lua_gettable;
  // module.exports.lua_gettop            = lua_gettop;
  // module.exports.lua_getupvalue        = lua_getupvalue;
  // module.exports.lua_getuservalue      = lua_getuservalue;
  // module.exports.lua_insert            = lua_insert;
  // module.exports.lua_isboolean         = lua_isboolean;
  // module.exports.lua_iscfunction       = lua_iscfunction;
  // module.exports.lua_isfunction        = lua_isfunction;
  // module.exports.lua_isinteger         = lua_isinteger;
  // module.exports.lua_islightuserdata   = lua_islightuserdata;
  // module.exports.lua_isnil             = lua_isnil;
  // module.exports.lua_isnone            = lua_isnone;
  // module.exports.lua_isnoneornil       = lua_isnoneornil;
  // module.exports.lua_isnumber          = lua_isnumber;
  // module.exports.lua_isproxy           = lua_isproxy;
  // module.exports.lua_isstring          = lua_isstring;
  // module.exports.lua_istable           = lua_istable;
  // module.exports.lua_isthread          = lua_isthread;
  // module.exports.lua_isuserdata        = lua_isuserdata;
  // module.exports.lua_len               = lua_len;
  // module.exports.lua_load              = lua_load;
  // module.exports.lua_newtable          = lua_newtable;
  // module.exports.lua_newuserdata       = lua_newuserdata;
  // module.exports.lua_next              = lua_next;
  const lua_pcall: (L: lua_State, n: number, r: number, f: number) => number;
  // module.exports.lua_pcallk            = lua_pcallk;
  const lua_pop: (L: lua_State, n: number) => void;
  const lua_pushboolean: (L: lua_State, b: boolean) => void;
  // module.exports.lua_pushcclosure      = lua_pushcclosure;
  // module.exports.lua_pushcfunction     = lua_pushcfunction;
  // module.exports.lua_pushfstring       = lua_pushfstring;
  // module.exports.lua_pushglobaltable   = lua_pushglobaltable;
  const lua_pushinteger: (L: lua_State, n: number) => void;
  // module.exports.lua_pushjsclosure     = lua_pushjsclosure;
  // module.exports.lua_pushjsfunction    = lua_pushjsfunction;
  const lua_pushlightuserdata: (L: lua_State, p: unknown) => void;
  // module.exports.lua_pushliteral       = lua_pushliteral;
  // module.exports.lua_pushlstring       = lua_pushlstring;
  const lua_pushnil: (L: lua_State) => void;
  const lua_pushnumber: (L: lua_State, n: number) => void;
  const lua_pushstring: (L: lua_State, s: string) => string;
  // module.exports.lua_pushthread        = lua_pushthread;
  // module.exports.lua_pushvalue         = lua_pushvalue;
  // module.exports.lua_pushvfstring      = lua_pushvfstring;
  // module.exports.lua_rawequal          = lua_rawequal;
  // module.exports.lua_rawget            = lua_rawget;
  const lua_rawgeti: (L: lua_State, idx: number, n: number) => unknown;
  // module.exports.lua_rawgetp           = lua_rawgetp;
  // module.exports.lua_rawlen            = lua_rawlen;
  // module.exports.lua_rawset            = lua_rawset;
  // module.exports.lua_rawseti           = lua_rawseti;
  // module.exports.lua_rawsetp           = lua_rawsetp;
  const lua_register: (L: lua_State, n: string, f: (L: lua_State) => number) => void;
  // module.exports.lua_remove            = lua_remove;
  // module.exports.lua_replace           = lua_replace;
  // module.exports.lua_rotate            = lua_rotate;
  // module.exports.lua_setallocf         = lua_setallocf;
  // module.exports.lua_setfield          = lua_setfield;
  // module.exports.lua_setglobal         = lua_setglobal;
  // module.exports.lua_seti              = lua_seti;
  // module.exports.lua_setmetatable      = lua_setmetatable;
  // module.exports.lua_settable          = lua_settable;
  // module.exports.lua_settop            = lua_settop;
  // module.exports.lua_setupvalue        = lua_setupvalue;
  // module.exports.lua_setuservalue      = lua_setuservalue;
  // module.exports.lua_status            = lua_status;
  // module.exports.lua_stringtonumber    = lua_stringtonumber;
  const lua_toboolean: (L: lua_State, idx: number) => boolean;
  // module.exports.lua_tocfunction       = lua_tocfunction;
  // module.exports.lua_todataview        = lua_todataview;
  // module.exports.lua_tointeger         = lua_tointeger;
  // module.exports.lua_tointegerx        = lua_tointegerx;
  // module.exports.lua_tojsstring        = lua_tojsstring;
  // module.exports.lua_tolstring         = lua_tolstring;
  // module.exports.lua_tonumber          = lua_tonumber;
  // module.exports.lua_tonumberx         = lua_tonumberx;
  // module.exports.lua_topointer         = lua_topointer;
  // module.exports.lua_toproxy           = lua_toproxy;
  // module.exports.lua_tostring          = lua_tostring;
  // module.exports.lua_tothread          = lua_tothread;
  const lua_touserdata: (L: lua_State, idx: number) => unknown;
  // module.exports.lua_type              = lua_type;
  // module.exports.lua_typename          = lua_typename;
  // module.exports.lua_upvalueid         = lua_upvalueid;
  // module.exports.lua_upvaluejoin       = lua_upvaluejoin;
  // module.exports.lua_version           = lua_version;
  // module.exports.lua_xmove             = lua_xmove;
}

declare module 'fengari/src/ldo' {
  import { lua_State } from 'fengari/src/lstate';

  // module.exports.adjust_top           = adjust_top;
  // module.exports.luaD_call            = luaD_call;
  // module.exports.luaD_callnoyield     = luaD_callnoyield;
  // module.exports.luaD_checkstack      = luaD_checkstack;
  // module.exports.luaD_growstack       = luaD_growstack;
  // module.exports.luaD_hook            = luaD_hook;
  // module.exports.luaD_inctop          = luaD_inctop;
  // module.exports.luaD_pcall           = luaD_pcall;
  // module.exports.luaD_poscall         = luaD_poscall;
  // module.exports.luaD_precall         = luaD_precall;
  // module.exports.luaD_protectedparser = luaD_protectedparser;
  // module.exports.luaD_rawrunprotected = luaD_rawrunprotected;
  // module.exports.luaD_reallocstack    = luaD_reallocstack;
  // module.exports.luaD_throw           = luaD_throw;
  // module.exports.lua_isyieldable      = lua_isyieldable;
  const lua_resume: (L: lua_State, from: lua_State, nargs: number) => number;
  const lua_yield: (L: lua_State, n: number) => void;
  // module.exports.lua_yieldk           = lua_yieldk;
}

declare module 'fengari/src/defs' {
  // module.exports.luastring_from    = luastring_from;
  // module.exports.luastring_indexOf = luastring_indexOf;
  // module.exports.luastring_of      = luastring_of;
  // module.exports.is_luastring      = is_luastring;
  // module.exports.luastring_eq      = luastring_eq;
  const to_jsstring: (value: Uint8Array, from?: number, to?: number, replacement_char?: boolean) => string;
  // module.exports.to_uristring      = to_uristring;
  const to_luastring: (str: string, cache?: boolean) => Uint8Array;
  // module.exports.from_userstring   = from_userstring;

  // module.exports.LUA_SIGNATURE       = LUA_SIGNATURE;
  // module.exports.LUA_VERSION_MAJOR   = LUA_VERSION_MAJOR;
  // module.exports.LUA_VERSION_MINOR   = LUA_VERSION_MINOR;
  // module.exports.LUA_VERSION_NUM     = LUA_VERSION_NUM;
  // module.exports.LUA_VERSION_RELEASE = LUA_VERSION_RELEASE;
  // module.exports.LUA_VERSION         = LUA_VERSION;
  // module.exports.LUA_RELEASE         = LUA_RELEASE;
  // module.exports.LUA_COPYRIGHT       = LUA_COPYRIGHT;
  // module.exports.LUA_AUTHORS         = LUA_AUTHORS;

  // module.exports.LUA_HOOKCALL            = LUA_HOOKCALL;
  // module.exports.LUA_HOOKCOUNT           = LUA_HOOKCOUNT;
  // module.exports.LUA_HOOKLINE            = LUA_HOOKLINE;
  // module.exports.LUA_HOOKRET             = LUA_HOOKRET;
  // module.exports.LUA_HOOKTAILCALL        = LUA_HOOKTAILCALL;
  // module.exports.LUA_MASKCALL            = LUA_MASKCALL;
  // module.exports.LUA_MASKCOUNT           = LUA_MASKCOUNT;
  // module.exports.LUA_MASKLINE            = LUA_MASKLINE;
  // module.exports.LUA_MASKRET             = LUA_MASKRET;
  // module.exports.LUA_MINSTACK            = LUA_MINSTACK;
  // module.exports.LUA_MULTRET             = -1;
  // module.exports.LUA_OPADD               = LUA_OPADD;
  // module.exports.LUA_OPBAND              = LUA_OPBAND;
  // module.exports.LUA_OPBNOT              = LUA_OPBNOT;
  // module.exports.LUA_OPBOR               = LUA_OPBOR;
  // module.exports.LUA_OPBXOR              = LUA_OPBXOR;
  // module.exports.LUA_OPDIV               = LUA_OPDIV;
  // module.exports.LUA_OPEQ                = LUA_OPEQ;
  // module.exports.LUA_OPIDIV              = LUA_OPIDIV;
  // module.exports.LUA_OPLE                = LUA_OPLE;
  // module.exports.LUA_OPLT                = LUA_OPLT;
  // module.exports.LUA_OPMOD               = LUA_OPMOD;
  // module.exports.LUA_OPMUL               = LUA_OPMUL;
  // module.exports.LUA_OPPOW               = LUA_OPPOW;
  // module.exports.LUA_OPSHL               = LUA_OPSHL;
  // module.exports.LUA_OPSHR               = LUA_OPSHR;
  // module.exports.LUA_OPSUB               = LUA_OPSUB;
  // module.exports.LUA_OPUNM               = LUA_OPUNM;
  const LUA_REGISTRYINDEX: number;
  // module.exports.LUA_RIDX_GLOBALS        = LUA_RIDX_GLOBALS;
  // module.exports.LUA_RIDX_LAST           = LUA_RIDX_LAST;
  // module.exports.LUA_RIDX_MAINTHREAD     = LUA_RIDX_MAINTHREAD;
  // module.exports.constant_types          = constant_types;
  // module.exports.lua_Debug               = lua_Debug;
  // module.exports.lua_upvalueindex        = lua_upvalueindex;
  const thread_status: {
    LUA_OK:        0,
    LUA_YIELD:     1,
    LUA_ERRRUN:    2,
    LUA_ERRSYNTAX: 3,
    LUA_ERRMEM:    4,
    LUA_ERRGCMM:   5,
    LUA_ERRERR:    6
  };
}
