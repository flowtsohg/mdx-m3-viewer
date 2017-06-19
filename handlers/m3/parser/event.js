/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserEvent(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {M3ParserReference} */
    this.name = new M3ParserReference(reader, index);
    /** @member {number} */
    this.unknown0 = reader.readInt32();
    /** @member {number} */
    this.unknown1 = reader.readInt16();
    /** @member {number} */
    this.unknown2 = reader.readUint16();
    /** @member {Float32Array} */
    this.matrix = reader.readFloat32Array(16);
    /** @member {number} */
    this.unknown3 = reader.readInt32();
    /** @member {number} */
    this.unknown4 = reader.readInt32();
    /** @member {number} */
    this.unknown5 = reader.readInt32();

    if (version > 0) {
        /** @member {number} */
        this.unknown6 = reader.readInt32();
        /** @member {number} */
        this.unknown7 = reader.readInt32();
    }

    if (version > 1) {
        /** @member {number} */
        this.unknown8 = reader.readInt32();
    }
}
