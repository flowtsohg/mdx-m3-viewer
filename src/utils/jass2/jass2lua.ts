import TokenStream from './tokenstream';

export default function jass2lua(jass: string) {
  let stream = new TokenStream(jass);
  let tokens = [];
  let token;

  while ((token = stream.read()) !== undefined) {
    if (token === 'function') {
      let name = stream.readSafe();

      stream.read(); // takes

      token = stream.read(); // nothing or type

      let params = '';

      if (token !== 'nothing') {
        params += stream.readSafe();

        while (stream.read() === ',') {
          stream.read();

          params += ',' + stream.readSafe();
        }
      } else {
        stream.read(); // returns
      }

      stream.read(); // return type

      let header = `function ${name}(${params})`;
      let body = [];

      while ((token = stream.readSafe()) !== 'endfunction') {
        if (token === 'local') {
          stream.read(); // type

          let arrayOrName = stream.readSafe();

          if (arrayOrName === 'array') {
            body.push(`local ${stream.readSafe()}={}`);
          } else {
            body.push(`local ${arrayOrName}${stream.readUntil('\n')}\n`);
          }
        } else if (token === 'if' || token === 'elseif' || token === 'not') {
          body.push(token + ' ');
        } else if (token === 'then') {
          body.push(' ' + token);
        } else if (token === 'loop') {
          body.push('while 1 do');
        } else if (token === 'endloop' || token === 'endif') {
          body.push('end');
        } else if (token === 'exitwhen') {
          body.push(`if ${stream.readUntil('\n')} then break end\n`);
        } else if (token === 'return') {
          let value = stream.readUntil('\n');

          token = stream.peek();

          // return statmentes can only be the last statements in their block.
          // If a statement isn't the last in its block, it is inserted into its own if block.
          if (token === 'endif' || token === 'endloop' || token === 'endfunction') {
            body.push(`return ${value}\n`);
          } else {
            body.push(`if 1 then return ${value} end\n`);
          }
        } else if (token === '\n') {
          let lastLine = body[body.length - 1];

          if (lastLine && lastLine[lastLine.length - 1] !== '\n') {
            body.push('\n');
          }
        } else if (token !== 'set' && token !== 'call' && token !== 'function') {
          body.push(token);
        }
      }

      tokens.push(`${header}\n${body.join('')}end`);
    } else if (token === 'globals') {
      while ((token = stream.read()) !== 'endglobals') {
        if (token !== '\n') {
          // token can either be type or constant.
          if (token === 'constant') {
            token = stream.read();
          }

          let arrayOrName = stream.read();

          if (arrayOrName === 'array') {
            tokens.push(`${stream.readSafe()}={}`);
          } else {
            // Unlike locals, having a global name with no value is a syntax error.
            // In addition, globals that are nil effectively don't exist in Lua.
            // Therefore, remove both cases.
            let value = 'nil';

            if (stream.peek() === '=') {
              stream.read(); // =

              value = stream.readUntil('\n');
            }

            if (value !== 'nil') {
              tokens.push(`${arrayOrName}=${value}`);
            }
          }
        }
      }
    }
  }

  return tokens.join('\n');
}
