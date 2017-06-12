/**
 * @constructor
 */
function M3ParserBatch(reader, version, index) {
    this.unknown0 = reader.readUint32();
    this.regionIndex = reader.readUint16();
    this.unknown1 = reader.readUint32();
    this.materialReferenceIndex = reader.readUint16();
    this.unknown2 = reader.readUint16();
}