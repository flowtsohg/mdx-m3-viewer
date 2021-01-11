import TokenStream from '../../mdlx/tokenstream';

/**
 * war3map.wts - the string table file.
 *
 * Contains a map of number->string.
 * When other map data like triggers use the string TRIGSTR_XXX, where XXX is a number, the value will be fetched from the table.
 */
export default class War3MapWts {
  stringMap: Map<number, string> = new Map();

  load(buffer: string) {
    let stream = new TokenStream(buffer);
    let token;

    // Find the first instance of "STRING".
    // There are some weird war3map.wts files that begin with the bytes "ï»¿", and this causes the tokenizer to see the first token as "ï»¿STRING".
    // Going to the first "STRING" means we can ignore any weird bytes that happened to be before.
    let start = buffer.indexOf('STRING');

    // Can war3map.wts have no entries? I don't know, might as well add a condition.
    if (start === -1) {
      return;
    }

    stream.index = start;

    while ((token = stream.readToken())) {
      if (token === 'STRING') {
        let index = stream.readInt();

        stream.read(); // {

        let end = buffer.indexOf('}', stream.index);

        // For broken files, keep whatever data can be kept, and throw an exception.
        if (end === -1) {
          this.stringMap.set(index, buffer.slice(stream.index, buffer.length).trim());

          throw new Error(`WTS: missing data in string ${this.stringMap.size} (and maybe more)`);
        }

        this.stringMap.set(index, buffer.slice(stream.index, end).trim());

        stream.index = end;
      }
    }
  }

  save() {
    let buffer = '';

    for (let [key, value] of this.stringMap) {
      buffer += `STRING ${key}\n{\n${value}\n}\n`;
    }

    return buffer;
  }
}
