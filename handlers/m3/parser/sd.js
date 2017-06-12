/**
 * @constructor
 */
function M3ParserSD(reader, version, index) {
    this.keys = new M3ParserReference(reader, index);
    this.flags = reader.readUint32();
    this.biggestKey = reader.readUint32();
    this.values = new M3ParserReference(reader, index);
}