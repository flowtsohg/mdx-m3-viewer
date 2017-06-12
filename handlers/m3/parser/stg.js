/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserSTG(reader, version, index) {
    this.version = version;
    this.name = new M3ParserReference(reader, index);
    this.stcIndices = new M3ParserReference(reader, index);
}
