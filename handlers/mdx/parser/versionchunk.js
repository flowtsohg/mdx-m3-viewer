/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {string} tag
 * @param {number} size
 * @param {Array<MdxParserNode>} nodes
 */
function MdxParserVersionChunk(reader, tag, size, nodes) {
    /** @member {number} */
    this.version = reader.readUint32();
}
