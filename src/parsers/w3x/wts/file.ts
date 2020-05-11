import TokenStream from '../../mdlx/tokenstream';

/**
 * war3map.wts - the string table file.
 *
 * Contains a map of number->string.
 * When other map data like triggers use the string TRIGSTR_XXX, where XXX is a number, the value will be fetched from the table.
 */
export default class War3MapWts {
  stringMap: Map<number, string> = new Map();

  constructor(buffer?: string) {
    if (buffer) {
      this.load(buffer);
    }
  }

  load(buffer: string) {
    let stream = new TokenStream(buffer);
    let token;

    stream.index += 3; // ï»¿???

    while ((token = stream.readToken())) {
      if (token === 'STRING') {
        let index = stream.readInt();

        stream.read(); // {

        let end = buffer.indexOf('}', stream.index);

        this.stringMap.set(index, buffer.slice(stream.index, end).trim());

        stream.index = end;
      }
    }
  }

  save() {
    let buffer = 'ï»¿'; // ï»¿???

    for (let [key, value] of this.stringMap) {
      buffer += `STRING ${key}\n{\n${value}\n}\n`;
    }

    return buffer;
  }
}
