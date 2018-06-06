let stringRegex = /STRING\s+(\d+)\s*{\s*([\s\S]+?)\s*}/g;
let newLineRegex = /\r\n/g;
let newLineLiteralRegex = /\\n/g;

/**
 * war3map.wts - the string table file.
 *
 * Contains a map of number->string.
 * When other map data like triggers use the string TRIGSTR_XXX, where XXX is a number, the value will be fetched from the table.
 */
export default class War3MapWts {
  /**
   * @param {?string} buffer
   */
  constructor(buffer) {
    /** @member {Map<number, string>} */
    this.stringMap = new Map();

    if (buffer) {
      this.load(buffer);
    }
  }

  /**
   * @param {string} buffer
   */
  load(buffer) {
    buffer = buffer.substring(3); // ???

    let match;

    while ((match = stringRegex.exec(buffer))) {
      // praseInt to consistently support numbers such as 1 and 001.
      this.stringMap.set(parseInt(match[1], 10), match[2].replace(newLineRegex, '\\n'));
    }
  }

  /**
   * @return {string}
   */
  save() {
    let buffer = 'ï»¿'; // ???

    for (let [key, value] of this.stringMap) {
      buffer += `STRING ${key}\n{\n${value.replace(newLineLiteralRegex, '\n')}\n}\n`;
    }

    return buffer;
  }
}
