/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserDivision(reader, version, index) {
    this.version = version;
    this.triangles = new M3ParserReference(reader, index);
    this.regions = new M3ParserReference(reader, index);
    this.batches = new M3ParserReference(reader, index);
    this.MSEC = new M3ParserReference(reader, index);
    this.unknown0 = reader.readUint32();
}
