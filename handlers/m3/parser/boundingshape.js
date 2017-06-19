/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 */
function M3ParserBoundingShape(reader) {
    /** @member {number} */
    this.shape = reader.readUint32();
    /** @member {number} */
    this.bone = reader.readInt16();
    /** @member {number} */
    this.unknown0 = reader.readUint16();
    /** @member {Float32Array} */
    this.matrix = reader.readFloat32Array(16);
    /** @member {number} */
    this.unknown1 = reader.readUint32();
    /** @member {number} */
    this.unknown2 = reader.readUint32();
    /** @member {number} */
    this.unknown3 = reader.readUint32();
    /** @member {number} */
    this.unknown4 = reader.readUint32();
    /** @member {number} */
    this.unknown5 = reader.readUint32();
    /** @member {number} */
    this.unknown6 = reader.readUint32();
    /** @member {Float32Array} */
    this.size = reader.readFloat32Array(3);
}
