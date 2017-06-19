/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserDivision(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {M3ParserReference} */
    this.triangles = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.regions = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.batches = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.MSEC = new M3ParserReference(reader, index);
    /** @member {number} */
    this.unknown0 = reader.readUint32();
}
