import W3xUnit from './unit';

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function W3xUnits(reader) {
    this.id = reader.read(4);
    this.version = reader.readInt32();

    reader.skip(4); // ?

    this.units = [];

    for (let i = 0, l = reader.readInt32(); i < l; i++) {
        this.units[i] = new W3xUnit(reader, this.version);
    }
}

export default W3xUnits;
