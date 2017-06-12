/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserBone(reader, version, index) {
    this.version = version;
    this.unknown0 = reader.readInt32();
    this.name = new M3ParserReference(reader, index);
    this.flags = reader.readUint32();
    this.parent = reader.readInt16();
    this.unknown1 = reader.readUint16();
    this.location = new M3ParserVector3AnimationReference(reader);
    this.rotation = new M3ParserVector4AnimationReference(reader);
    this.scale = new M3ParserVector3AnimationReference(reader);
    this.visibility = new M3ParserUint32AnimationReference(reader);
}
