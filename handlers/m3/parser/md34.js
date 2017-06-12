/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserMD34(reader, version, index) {
    this.tag = reader.read(4).reverse();
    this.offset = reader.readUint32();
    this.entries = reader.readUint32();
    this.model = new M3ParserReference(reader, index);
}
