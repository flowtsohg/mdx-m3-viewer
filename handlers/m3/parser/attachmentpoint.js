/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserAttachmentPoint(reader, version, index) {
    this.version = version;
    this.unknown = reader.readInt32();
    this.name = new M3ParserReference(reader, index);
    this.bone = reader.readUint32();
}
