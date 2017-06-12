/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserSTS(reader, version, index) {
    this.version = version;
    this.animIds = new M3ParserReference(reader, index);

    reader.skip(16); // ?
}
