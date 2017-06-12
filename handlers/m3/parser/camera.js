/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserCamera(reader, version, index) {
    this.version = version;
    this.bone = reader.readUint32();
    this.name = new M3ParserReference(reader, index);
    this.fieldOfView = new M3ParserFloat32AnimationReference(reader);
    this.unknown0 = reader.readUint32();
    this.farClip = new M3ParserFloat32AnimationReference(reader);
    this.nearClip = new M3ParserFloat32AnimationReference(reader);
    this.clip2 = new M3ParserFloat32AnimationReference(reader);
    this.focalDepth = new M3ParserFloat32AnimationReference(reader);
    this.falloffStart = new M3ParserFloat32AnimationReference(reader);
    this.falloffEnd = new M3ParserFloat32AnimationReference(reader);
    this.depthOfField = new M3ParserFloat32AnimationReference(reader);
}
