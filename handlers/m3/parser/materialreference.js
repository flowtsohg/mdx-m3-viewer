/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserMaterialReference(reader, version, index) {
    this.materialType = reader.readUint32();
    this.materialIndex = reader.readUint32();
}
