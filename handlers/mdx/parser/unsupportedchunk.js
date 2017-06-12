/**
 * @constructor
 * @see This is used for chunks that are not supported (e.g. custom chunks injected by authoring tools).
 *      The chunk will contain its own reader, in case the client code wants to do anything with it.
 * @param {MdxParserBinaryReader} reader
 * @param {string} tag
 * @param {number} size
 * @param {Array<MdxNode>} nodes
 */
function MdxParserUnsupportedChunk(reader, tag, size, nodes) {
    this.reader = reader;
    this.tag = tag;
    this.size = size;
    this.nodes = nodes;
}
