/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserMaterialReference(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {number} */
    this.materialType = reader.readUint32();
    /** @member {number} */
    this.materialIndex = reader.readUint32();
}

export default M3ParserMaterialReference;
