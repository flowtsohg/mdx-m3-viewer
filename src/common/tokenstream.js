/**
 * Used to read and write structured text formats.
 */
export default class TokenStream {
  /**
   * @param {?string} buffer
   */
  constructor(buffer) {
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
   *
   * @return {?string}
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
        if (c === '"') {
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
   * Reads the next token without advancing the stream.
   *
   * @return {string}
   */
  peek() {
    let index = this.index;
    let value = this.read();

    this.index = index;

    return value;
  }

  /**
   * Reads the next token, and parses it as an integer.
   *
   * @return {number}
   */
  readInt() {
    return parseInt(this.read());
  }

  /**
   * Reads the next token, and parses it as a float.
   *
   * @return {number}
   */
  readFloat() {
    return parseFloat(this.read());
  }

  /**
   * Read an MDL keyframe value.
   * If the value is a scalar, it us just the number.
   * If the value is a vector, it is enclosed with curly braces.
   * @param {Float32Array|Uint32Array} value
   */
  readKeyframe(value) {
    if (value.length === 1) {
      if (value instanceof Float32Array) {
        value[0] = this.readFloat();
      } else {
        value[0] = this.readInt();
      }
    } else {
      this.readTypedArray(value);
    }
  }

  /**
   * Reads an array of integers in the form:
   *     { Value1, Value2, ..., ValueN }
   *
   * @param {ArrayBufferView} view
   * @return {ArrayBufferView}
   */
  readIntArray(view) {
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
   *
   * @param {ArrayBufferView} view
   * @return {ArrayBufferView}
   */
  readFloatArray(view) {
    this.read(); // {

    for (let i = 0, l = view.length; i < l; i++) {
      view[i] = this.readFloat();
    }

    this.read(); // }

    return view;
  }

  /**
   * Reads into a uint or float typed array.
   *
   * @param {Uint32Array|Float32Array} view
   */
  readTypedArray(view) {
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
   *
   * @param {Float32Array} view
   */
  readColor(view) {
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
   *
   * @param {ArrayBufferView} view
   * @param {number} size
   * @return {ArrayBufferView}
   */
  readVectorArray(view, size) {
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
   *
   * @param {string} name 'Color' or 'static Color'.
   * @param {Float32Array} view
   */
  writeColor(name, view) {
    this.writeLine(`${name} { ${view[2]}, ${view[1]}, ${view[0]} },`);
  }

  /**
   * Flag,
   *
   * @param {string} flag
   */
  writeFlag(flag) {
    this.writeLine(`${flag},`);
  }

  /**
   * Name Value,
   *
   * @param {string} name
   * @param {number|string} value
   */
  writeAttrib(name, value) {
    this.writeLine(`${name} ${value},`);
  }

  /**
   * Same as writeAttrib, but formats the given number.
   *
   * @param {string} name
   * @param {number} value
   */
  writeFloatAttrib(name, value) {
    this.writeLine(`${name} ${this.formatFloat(value)},`);
  }

  /**
   * Name "Value",
   *
   * @param {string} name
   * @param {string} value
   */
  writeStringAttrib(name, value) {
    this.writeLine(`${name} "${value}",`);
  }

  /**
   * Name { Value0, Value1, ..., ValueN },
   *
   * @param {string} name
   * @param {TypedArray} value
   */
  writeArrayAttrib(name, value) {
    this.writeLine(`${name} { ${value.join(', ')} },`);
  }

  /**
   * Name { Value0, Value1, ..., ValueN },
   *
   * @param {string} name
   * @param {Float32Array} value
   */
  writeFloatArrayAttrib(name, value) {
    this.writeLine(`${name} { ${this.formatFloatArray(value)} },`);
  }

  /**
   * @param {string} name
   * @param {Uint32Array|Float32Array} value
   */
  writeTypedArrayAttrib(name, value) {
    if (value instanceof Float32Array) {
      this.writeFloatArrayAttrib(name, value);
    } else {
      this.writeArrayAttrib(name, value);
    }
  }

  /**
   * Write an MDL keyframe.
   *
   * @param {string} start
   * @param {Float32Array|Uint32Array} value
   */
  writeKeyframe(start, value) {
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
   *
   * @param {TypedArray} value
   */
  writeArray(value) {
    this.writeLine(`{ ${value.join(', ')} },`);
  }

  /**
   * { Value0, Value1, ..., ValueN },
   *
   * @param {Float32Array} value
   */
  writeFloatArray(value) {
    this.writeLine(`{ ${this.formatFloatArray(value)} },`);
  }

  /**
   * Name Entries {
   *     { Value1, Value2, ..., valueSize },
   *     { Value1, Value2, ..., valueSize },
   *     ...
   * }
   *
   * @param {string} name
   * @param {TypedArray} view
   * @param {number} size
   */
  writeVectorArray(name, view, size) {
    this.startBlock(name, view.length / size);

    for (let i = 0, l = view.length; i < l; i += size) {
      this.writeFloatArray(view.subarray(i, i + size));
    }

    this.endBlock();
  }

  /**
   * Adds the given string to the buffer.
   *
   * @param {string} s
   */
  write(s) {
    this.buffer += s;
  }

  /**
   * Adds the given string to the buffer.
   * The current indentation level is prepended, and the stream goes to the next line after the write.
   *
   * @param {string} line
   */
  writeLine(line) {
    this.buffer += `${'\t'.repeat(this.ident)}${line}\n`;
  }

  /**
   * Starts a new block in the form:
   *
   *      Header1 Header2 ... HeaderN {
   *          ...
   *      }
   *
   * @param {...string} headers
   */
  startBlock(...headers) {
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
   *
   * @param {string} header
   * @param {string} name
   */
  startObjectBlock(header, name) {
    this.writeLine(`${header} "${name}" {`);
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
   *
   * @param {number} value
   * @return {string}
   */
  formatFloat(value) {
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
   *
   * @param {Float32Array} value
   * @return {string}
   */
  formatFloatArray(value) {
    let result = [];

    for (let i = 0, l = value.length; i < l; i++) {
      result[i] = this.formatFloat(value[i]);
    }

    return result.join(', ');
  }
}
