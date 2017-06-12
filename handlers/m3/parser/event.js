/**
 * @constructor
 */
function M3ParserEvent(reader, version, index) {
    this.version = version;
    this.name = new M3ParserReference(reader, index);
    this.unknown0 = reader.readInt32();
    this.unknown1 = reader.readInt16();
    this.unknown2 = reader.readUint16();
    this.matrix = reader.readFloat32Array(16);
    this.unknown3 = reader.readInt32();
    this.unknown4 = reader.readInt32();
    this.unknown5 = reader.readInt32();

    if (version > 0) {
        this.unknown6 = reader.readInt32();
        this.unknown7 = reader.readInt32();
    }

    if (version > 1) {
        this.unknown8 = reader.readInt32();
    }
}
