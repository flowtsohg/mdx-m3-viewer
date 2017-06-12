/**
 * @constructor
 */
function M3ParserDivision(reader, version, index) {
    this.version = version;
    this.triangles = new M3ParserReference(reader, index);
    this.regions = new M3ParserReference(reader, index);
    this.batches = new M3ParserReference(reader, index);
    this.MSEC = new M3ParserReference(reader, index);
    this.unknown0 = reader.readUint32();
}
