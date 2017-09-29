/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {number} version
 */
function W3xParserSpecialDoodad(reader, version) {
    this.id = reader.read(4);

    reader.skip(4); // ?

    this.location = reader.readFloat32Array(2);
}

export default W3xParserSpecialDoodad;
