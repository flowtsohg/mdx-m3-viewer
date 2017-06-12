/**
 * @constructor
 */
function M3ParserBoundingShape(reader) {
    this.shape = reader.readUint32();
    this.bone = reader.readInt16();
    this.unknown0 = reader.readUint16();
    this.matrix = reader.readFloat32Array(16);
    this.unknown1 = reader.readUint32();
    this.unknown2 = reader.readUint32();
    this.unknown3 = reader.readUint32();
    this.unknown4 = reader.readUint32();
    this.unknown5 = reader.readUint32();
    this.unknown6 = reader.readUint32();
    this.size = reader.readFloat32Array(3);
}
