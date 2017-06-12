/**
 * @constructor
 */
function M3ParserMaterialReference(reader, version, index) {
    this.materialType = reader.readUint32();
    this.materialIndex = reader.readUint32();
}
