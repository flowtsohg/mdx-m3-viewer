import W3xDoodad from './doodad';
import W3xSpecialDoodad from './specialdoodad';

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function W3xDoodads(reader) {
    this.id = reader.read(4);
    this.version = reader.readInt32();

    reader.skip(4); // ?

    this.doodads = [];

    for (let i = 0, l = reader.readInt32(); i < l; i++) {
        this.doodads[i] = new W3xDoodad(reader, this.version)
    }

    reader.skip(4); // ?
    
    this.specialDoodads = [];

    for (let i = 0, l = reader.readInt32(); i < l; i++) {
        this.specialDoodads[i] = new W3xSpecialDoodad(reader, this.version)
    }

}

export default W3xDoodads;
