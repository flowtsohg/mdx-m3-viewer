/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {string} tag
 * @param {number} size
 * @param {Array<MdxNode>} nodes
 */
function MdxParserVersionChunk(reader, tag, size, nodes) {
    this.version = reader.readUint32();
}
