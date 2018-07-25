import TokenStream from '../../../common/tokenstream';

let newLineRegex = /\n/g;
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
    let stream = new TokenStream(buffer);
    let token;

    stream.index += 3; // ï»¿???

    while ((token = stream.read())) {
      if (token === 'STRING') {
        let index = stream.readInt();

        stream.read(); // {

        let end = buffer.indexOf('}', stream.index);

        this.stringMap.set(index, buffer.slice(stream.index, end).trim());

        stream.index = end;
      }
    }
  }

  /**
   * @return {string}
   */
  save() {
    let buffer = 'ï»¿'; // ï»¿???

    for (let [key, value] of this.stringMap) {
      buffer += `STRING ${key}\n{\n${value}\n}\n`;
    }

    return buffer;
  }
}
