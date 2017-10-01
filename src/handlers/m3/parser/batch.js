/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserBatch(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {number} */
    this.unknown0 = reader.readUint32();
    /** @member {number} */
    this.regionIndex = reader.readUint16();
    /** @member {number} */
    this.unknown1 = reader.readUint32();
    /** @member {number} */
    this.materialReferenceIndex = reader.readUint16();
    /** @member {number} */
    this.unknown2 = reader.readUint16();
}

export default M3ParserBatch;
