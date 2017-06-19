/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserAttachmentPoint(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {number} */
    this.unknown = reader.readInt32();
    /** @member {M3ParserReference} */
    this.name = new M3ParserReference(reader, index);
    /** @member {number} */
    this.bone = reader.readUint32();
}
