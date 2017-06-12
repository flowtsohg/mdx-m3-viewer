/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {number} index
 */
function MdxParserLayer(reader, index) {
    this.index = index;
    this.size = reader.readUint32();
    this.filterMode = reader.readUint32();
    this.flags = reader.readUint32();
    this.textureId = reader.readUint32();
    this.textureAnimationId = reader.readInt32();
    this.coordId = reader.readUint32();
    this.alpha = reader.readFloat32();
    this.tracks = new MdxParserSDContainer(reader, this.size - 28);
}
