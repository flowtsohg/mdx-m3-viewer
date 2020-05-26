import { floatDecimals, floatArrayDecimals } from '../../common/math';

/**
 * Used to read and write MDL tokens.
 */
export default class TokenStream {
  buffer: string;
  index: number = 0;
  ident: number = 0;
  precision: number = 1000000; // 6 digits after the decimal point.

  constructor(buffer?: string) {
    this.buffer = buffer || '';
  }

  /**
   * Reads the next token in the stream.
   * Whitespaces are ignored outside of strings in the form of "".
   * Comments in the form of // are ignored.
   * Commas and colons are ignored as well.
   * Curly braces are used as separators, generally to denote text blocks.
   *
   * For example, given the following string:
   *
   *     Header "A String" {
   *         Name Value, // A Comment
   *     }
   *
   * Read will return the values in order:
   *
   *     Header
   *     "A String"
   *     {
   *     Name
   *     Value
   *     }
   *
   * There are wrappers around read, below, that help to read structured code, check them out!
   */
  readToken() {
    let buffer = this.buffer;
    let length = buffer.length;
    let inComment = false;
    let inString = false;
    let token = '';

    while (this.index < length) {
      let c = buffer[this.index++];

      if (inComment) {
        if (c === '\n') {
          inComment = false;
        }
      } else if (inString) {
        if (c === '\\') {
          token += c + buffer[this.index++];
        } else if (c === '\n') {
          token += '\\n';
        } else if (c === '\r') {
          token += '\\r';
        } else if (c === '"') {
          return token;
        } else {
          token += c;
        }
      } else if (c === ' ' || c === ',' || c === '\t' || c === '\n' || c === ':' || c === '\r') {
        if (token.length) {
          return token;
        }
      } else if (c === '{' || c === '}') {
        if (token.length) {
          this.index--;
          return token;
        } else {
          return c;
        }
      } else if (c === '/' && buffer[this.index] === '/') {
        if (token.length) {
          this.index--;
          return token;
        } else {
          inComment = true;
        }
      } else if (c === '"') {
        if (token.length) {
          this.index--;
          return token;
        } else {
          inString = true;
        }
      } else {
        token += c;
      }
    }
  }

  /**
   * Same as readToken, but if the end of the stream was encountered, an exception will be thrown.
   */
  read() {
    let value = this.readToken();

    if (value === undefined) {
      throw new Error('End of stream reached prematurely');
    }

    return value;
  }

  /**
   * Reads the next token without advancing the stream.
   */
  peek() {
    let index = this.index;
    let value = this.read();

    this.index = index;

    return value;
  }

  /**
   * Reads the next token, and parses it as an integer.
   */
  readInt() {
    return parseInt(this.read());
  }

  /**
   * Reads the next token, and parses it as a float.
   */
  readFloat() {
    return parseFloat(this.read());
  }

  /**
   * { Number0, Number1, ..., NumberN }
   */
  readVector(view: Uint8Array | Uint16Array | Uint32Array | Float32Array) {
    this.read(); // {

    for (let i = 0, l = view.length; i < l; i++) {
      view[i] = this.readFloat();
    }

    this.read(); // }

    return view;
  }

  /**
   * {
   *     { Value1, Value2, ..., ValueSize },
   *     { Value1, Value2, ..., ValueSize },
   *     ...
   * }
   */
  readVectorsBlock(view: Uint16Array | Float32Array, size: number) {
    this.read(); // {

    for (let i = 0, l = view.length; i < l; i += size) {
      this.readVector(view.subarray(i, i + size));
    }

    this.read(); // }

    return view;
  }

  /**
   * Reads a color in the form:
   *
   *      { R, G, B }
   *
   * The color is sizzled to BGR.
   */
  readColor(view: Float32Array) {
    this.read(); // {

    view[2] = this.readFloat();
    view[1] = this.readFloat();
    view[0] = this.readFloat();

    this.read(); // }

    return view;
  }

  /**
   * Helper generator for block reading.
   * Let's say we have a block like so:
   * 
   *     {
   *         Key1 Value1
   *         Key2 Value2
   *         ...
   *         KeyN ValueN
   *     }
   * 
   * The generator yields the keys one by one, and the caller needs to read the values based on the keys.
   * It is used for most MDL blocks.
   */
  * readBlock() {
    this.read(); // {

    let token = this.read();

    while (token !== '}') {
      yield token;

      token = this.read();
    }
  }

  /**
   * Adds the given string to the buffer.
   * The current indentation level is prepended, and the stream goes to the next line after the write.
   */
  writeLine(line: string) {
    this.buffer += `${'\t'.repeat(this.ident)}${line}\n`;
  }

  /**
   * Flag,
   */
  writeFlag(flag: string) {
    this.writeLine(`${flag},`);
  }

  /**
   * Name Flag,
   */
  writeFlagAttrib(name: string, flag: string) {
    this.writeLine(`${name} ${flag},`);
  }

  /**
   * Name Value,
   */
  writeNumberAttrib(name: string, value: number) {
    this.writeLine(`${name} ${floatDecimals(value, this.precision)},`);
  }

  /**
   * Name "Value",
   */
  writeStringAttrib(name: string, value: string) {
    this.writeLine(`${name} "${value}",`);
  }

  /**
   * Name { Value0, Value1, ..., ValueN }
   */
  writeVectorAttrib(name: string, value: Uint8Array | Uint32Array | Float32Array) {
    this.writeLine(`${name} { ${floatArrayDecimals(value, this.precision)} },`);
  }

  /**
   * Writes a color in the form:
   *
   *      { B, G, R }
   *
   * The color is sizzled to RGB.
   * The name can be either "Color" or "static Color", depending on the context.
   */
  writeColor(name: string, value: Float32Array) {
    let b = floatDecimals(value[0], this.precision);
    let g = floatDecimals(value[1], this.precision);
    let r = floatDecimals(value[2], this.precision);

    this.writeLine(`${name} { ${r}, ${g}, ${b} },`);
  }

  /**
   * { Value0, Value1, ..., ValueN },
   */
  writeVector(value: Uint16Array | Float32Array) {
    this.writeLine(`{ ${floatArrayDecimals(value, this.precision)} },`);
  }

  /**
   * Name Vectors {
   *     { Value1, Value2, ..., ValueSize },
   *     { Value1, Value2, ..., ValueSize },
   *     ...
   * }
   */
  writeVectorArrayBlock(name: string, view: Float32Array, size: number) {
    this.startBlock(name, view.length / size);

    for (let i = 0, l = view.length; i < l; i += size) {
      this.writeVector(view.subarray(i, i + size))
    }

    this.endBlock();
  }

  /**
   * Starts a new block in the form:
   *
   *      Header1 Header2 ... HeaderN {
   *          ...
   *      }
   */
  startBlock(name: string, ...headers: (string | number)[]) {
    if (headers.length) {
      name = `${name} ${headers.join(' ')}`;
    }

    this.writeLine(`${name} {`);
    this.ident += 1;
  }

  /**
   * Starts a new block in the form:
   *
   *      Header "Name" {
   *          ...
   *      }
   */
  startObjectBlock(header: string, name: string) {
    // Turns out you can have quotation marks in object names.
    this.writeLine(`${header} "${name.replace(/"/g, '\\"')}" {`);
    this.ident += 1;
  }

  /**
   * Ends a previously started block, and handles the indentation.
   */
  endBlock() {
    this.ident -= 1;
    this.writeLine('}');
  }

  /**
   * Ends a previously started block, and handles the indentation.
   * Adds a comma after the block end.
   */
  endBlockComma() {
    this.ident -= 1;
    this.writeLine('},');
  }

  /**
   * Increases the indentation level for following line writes.
   */
  indent() {
    this.ident += 1;
  }

  /**
   * Decreases the indentation level for following line writes.
   */
  unindent() {
    this.ident -= 1;
  }
}
