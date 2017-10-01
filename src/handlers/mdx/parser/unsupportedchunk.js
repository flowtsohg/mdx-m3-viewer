/**
 * @constructor
 * @see This is used for chunks that are not supported (e.g. custom chunks injected by authoring tools).
 *      The chunk will contain its own reader, in case the client code wants to do anything with it.
 * @param {BinaryReader} reader
 * @param {string} tag
 * @param {number} size
 * @param {Array<MdxParserNode>} nodes
 */
function MdxParserUnsupportedChunk(reader, tag, size, nodes) {
    /** @member {BinaryReader} */
    this.reader = reader;
    /** @member {string} */
    this.tag = tag;
    /** @member {number} */
    this.size = size;
    /** @member {Array<MdxParserNode>} */
    this.nodes = nodes;
}

export default MdxParserUnsupportedChunk;
