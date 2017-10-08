import W3xParserDoodad from './doodad';
import W3xParserSpecialDoodad from './specialdoodad';

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function W3xParserDoodads(reader) {
    this.id = reader.read(4);
    this.version = reader.readInt32();

    reader.skip(4); // ?

    this.doodads = [];

    for (let i = 0, l = reader.readInt32(); i < l; i++) {
        this.doodads[i] = new W3xParserDoodad(reader, this.version)
    }

    reader.skip(4); // ?
    
    this.specialDoodads = [];

    for (let i = 0, l = reader.readInt32(); i < l; i++) {
        this.specialDoodads[i] = new W3xParserSpecialDoodad(reader, this.version)
    }

}

export default W3xParserDoodads;
