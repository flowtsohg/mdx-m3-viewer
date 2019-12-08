/**
 * Used to read and write structured text formats.
 */
export default class TokenStream {
  buffer: string;
  index: number;
  ident: number;
  fractionDigits: number;

  constructor(buffer?: string) {
    this.buffer = buffer || '';
    this.index = 0;
    this.ident = 0; // Used for writing blocks nicely.
    this.fractionDigits = 6; // The number of fraction digits when writing floats.
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
  read() {
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

    return '';
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
   * Read an MDL keyframe value.
   * If the value is a scalar, it us just the number.
   * If the value is a vector, it is enclosed with curly braces.
   */
  readKeyframe(value: Uint32Array | Float32Array) {
    if (value.length === 1) {
      if (value instanceof Float32Array) {
        value[0] = this.readFloat();
      } else {
        value[0] = this.readInt();
      }
    } else {
      this.readTypedArray(value);
    }

    return value;
  }

  /**
   * Reads an array of integers in the form:
   *     { Value1, Value2, ..., ValueN }
   */
  readIntArray(view: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array) {
    this.read(); // {

    for (let i = 0, l = view.length; i < l; i++) {
      view[i] = this.readInt();
    }

    this.read(); // }

    return view;
  }

  /**
   * Reads an array of floats in the form:
   *     { Value1, Value2, ..., ValueN }
   */
  readFloatArray(view: Float32Array) {
    this.read(); // {

    for (let i = 0, l = view.length; i < l; i++) {
      view[i] = this.readFloat();
    }

    this.read(); // }

    return view;
  }

  /**
   * Reads into a uint or float typed array.
   */
  readTypedArray(view: Uint32Array | Float32Array) {
    if (view instanceof Float32Array) {
      this.readFloatArray(view);
    } else {
      this.readIntArray(view);
    }
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
  }

  /**
   * {
   *     { Value1, Value2, ..., ValueSize },
   *     { Value1, Value2, ..., ValueSize },
   *     ...
   * }
   */
  readVectorArray(view: Float32Array, size: number) {
    this.read(); // {

    for (let i = 0, l = view.length / size; i < l; i++) {
      this.read(); // {

      for (let j = 0; j < size; j++) {
        view[i * size + j] = this.readFloat();
      }

      this.read(); // }
    }

    this.read(); // }

    return view;
  }

  /**
   * Helper generator for block reading.
   * Let's say we have a block like so:
   *     {
   *         Key1 Value1
   *         Key2 Value2
   *         ...
   *         KeyN ValueN
   *     }
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
   * Writes a color in the form:
   *
   *      { B, G, R }
   *
   * The color is sizzled to RGB.
   * The name can be either "Color" or "static Color", depending on the context.
   */
  writeColor(name: string, view: Float32Array) {
    this.writeLine(`${name} { ${view[2]}, ${view[1]}, ${view[0]} },`);
  }

  /**
   * Flag,
   */
  writeFlag(flag: string) {
    this.writeLine(`${flag},`);
  }

  /**
   * Name Value,
   */
  writeAttrib(name: string, value: number | string) {
    this.writeLine(`${name} ${value},`);
  }

  /**
   * Same as writeAttrib, but formats the given number.
   */
  writeFloatAttrib(name: string, value: number) {
    this.writeLine(`${name} ${this.formatFloat(value)},`);
  }

  /**
   * Name "Value",
   */
  writeStringAttrib(name: string, value: string) {
    this.writeLine(`${name} "${value}",`);
  }

  /**
   * Name { Value0, Value1, ..., ValueN },
   */
  writeArrayAttrib(name: string, value: TypedArray) {
    this.writeLine(`${name} { ${value.join(', ')} },`);
  }

  /**
   * Name { Value0, Value1, ..., ValueN },
   */
  writeFloatArrayAttrib(name: string, value: Float32Array) {
    this.writeLine(`${name} { ${this.formatFloatArray(value)} },`);
  }

  /**
   * Write an array of integers or floats.
   */
  writeTypedArrayAttrib(name: string, value: Uint32Array | Float32Array) {
    if (value instanceof Float32Array) {
      this.writeFloatArrayAttrib(name, value);
    } else {
      this.writeArrayAttrib(name, value);
    }
  }

  /**
   * Write an MDL keyframe.
   */
  writeKeyframe(start: string, value: Uint32Array | Float32Array) {
    if (value.length === 1) {
      if (value instanceof Float32Array) {
        this.writeFloatAttrib(start, value[0]);
      } else {
        this.writeAttrib(start, value[0]);
      }
    } else {
      this.writeTypedArrayAttrib(start, value);
    }
  }

  /**
   * { Value0, Value1, ..., ValueN },
   */
  writeArray(value: TypedArray) {
    this.writeLine(`{ ${value.join(', ')} },`);
  }

  /**
   * { Value0, Value1, ..., ValueN },
   */
  writeFloatArray(value: Float32Array) {
    this.writeLine(`{ ${this.formatFloatArray(value)} },`);
  }

  /**
   * Name Entries {
   *     { Value1, Value2, ..., valueSize },
   *     { Value1, Value2, ..., valueSize },
   *     ...
   * }
   */
  writeVectorArray(name: string, view: Float32Array, size: number) {
    this.startBlock(name, view.length / size);

    for (let i = 0, l = view.length; i < l; i += size) {
      this.writeFloatArray(view.subarray(i, i + size));
    }

    this.endBlock();
  }

  /**
   * Adds the given string to the buffer.
   */
  write(s: string) {
    this.buffer += s;
  }

  /**
   * Adds the given string to the buffer.
   * The current indentation level is prepended, and the stream goes to the next line after the write.
   */
  writeLine(line: string) {
    this.buffer += `${'\t'.repeat(this.ident)}${line}\n`;
  }

  /**
   * Starts a new block in the form:
   *
   *      Header1 Header2 ... HeaderN {
   *          ...
   *      }
   */
  startBlock(...headers: (string | number)[]) {
    if (headers.length) {
      this.writeLine(`${headers.join(' ')} {`);
    } else {
      this.writeLine('{');
    }

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

  /**
   * Formats a given float to the shorter of either its string representation, or its fixed point representation with the stream's fraction digits.
   */
  formatFloat(value: number) {
    let s = value.toString();
    let f = value.toFixed(this.fractionDigits);

    if (s.length > f.length) {
      return f;
    } else {
      return s;
    }
  }

  /**
   * Uses formatFloat to format a whole array, and returns it as a comma separated string.
   */
  formatFloatArray(value: Float32Array) {
    let result = [];

    for (let i = 0, l = value.length; i < l; i++) {
      result[i] = this.formatFloat(value[i]);
    }

    return result.join(', ');
  }
}
