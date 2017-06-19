/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {string} tag
 * @param {number} size
 * @param {Array<MdxParserNode>} nodes
 */
function MdxParserModelChunk(reader, tag, size, nodes) {
    /** @member {string} */
    this.name = reader.read(80);
    /** @member {string} */
    this.animationPath = reader.read(260);
    /** @member {MdxParserExtent} */
    this.extent = new MdxParserExtent(reader);
    /** @member {number} */
    this.blendTime = reader.readUint32();
}
