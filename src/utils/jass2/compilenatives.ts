import TokenStream from './tokenstream';

function compileGetters(params: { type: string, name: string }[]): string {
  return params.map((p, i) => {
    const type = p.type;

    if (type === 'code') {
      return `let _${p.name} = luaL_ref(L, LUA_REGISTRYINDEX);`;
    } else {
      let func;

      if (type === 'integer') {
        func = 'luaL_checkinteger';
      } else if (type === 'real') {
        func = 'luaL_checknumber';
      } else if (type === 'boolean') {
        func = 'lua_toboolean';
      } else if (type === 'string') {
        func = 'luaL_checkstring';
      } else {
        func = 'lua_touserdata';
      }

      return `let _${p.name} = ${func}(L, ${i + 1});`;
    }
  }).join('\n');
}

function compileReturn(type: string): string {
  if (type === 'nothing') {
    return 'return 0';
  } else {
    let func;
    let value;

    if (type === 'integer') {
      func = 'lua_pushinteger';
      value = '0';
    } else if (type === 'real') {
      func = 'lua_pushnumber';
      value = '0';
    } else if (type === 'boolean') {
      func = 'lua_pushboolean';
      value = 'false';
    } else if (type === 'string') {
      func = 'lua_pushstring';
      value = `''`;
    } else if (type === 'code') {
      throw 'CODE??';
    } else {
      func = 'lua_pushlightuserdata';
      value = `{name: 'FAKE'}`;
    }

    return `${func}(L, ${value});\nreturn 1;`;
  }
}

function compileNative(stream: TokenStream, isConstant: boolean): { name: string, decl: string } {
  const name = stream.readSafe();
  const params = [];

  stream.read(); // takes

  const token = stream.readSafe(); // nothing or type

  if (token !== 'nothing') {
    params.push({ type: token, name: stream.readSafe() });

    while (stream.read() === ',') {
      params.push({ type: stream.readSafe(), name: stream.readSafe() });
    }
  } else {
    stream.read(); // returns
  }

  const returnType = stream.readSafe();
  let luaParams;

  if (params.length) {
    luaParams = 'C: Context, L: lua_State';
  } else {
    luaParams = '_C: Context, _L: lua_State';
  }

  const decl = `
/**
 * ${isConstant ? 'constant ' : ''}native ${name} takes ${params.length ? params.map((p) => `${p.type} ${p.name}`).join(', ') : 'nothing'} returns ${returnType}
 */
function ${name}(${luaParams}): number {
  ${compileGetters(params)}
  console.warn('${name} was called but is not implemented :(');
  ${compileReturn(returnType)}
}`;

  return { name, decl };
}

function compileBindings(names: string[]): string {
  return `
/**
 * Bind natives to the given context.
 */
export default function bind(C: Context): void {\nlet L = C.L;\n${names.map((name) => `  lua_register(L, '${name}', ${name}.bind(null, C));`).join('\n')}\n}`;
}

export default function compileNatives(jass: string): string {
  const stream = new TokenStream(jass);
  const names = [];
  const decls = [];
  let token;

  while ((token = stream.read()) !== undefined) {
    let isConstant = false;

    if (token === 'constant') {
      isConstant = true;

      token = stream.read();
    }

    if (token === 'native') {
      const { name, decl } = compileNative(stream, isConstant);

      names.push(name);
      decls.push(decl);
    }
  }

  return `${decls.join('\n')}\n${compileBindings(names)}\n`;
}
