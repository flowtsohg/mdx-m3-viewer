/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {number} index
 */
function MdxParserLayer(reader, index) {
    this.index = index;
    /** @member {number} */
    this.size = reader.readUint32();
    /** @member {number} */
    this.filterMode = reader.readUint32();
    /** @member {number} */
    this.flags = reader.readUint32();
    /** @member {number} */
    this.textureId = reader.readUint32();
    /** @member {number} */
    this.textureAnimationId = reader.readInt32();
    /** @member {number} */
    this.coordId = reader.readUint32();
    /** @member {number} */
    this.alpha = reader.readFloat32();
    /** @member {MdxParserSDContainer} */
    this.tracks = new MdxParserSDContainer(reader, this.size - 28);
}
