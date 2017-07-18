/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxNode>} nodes
 * @param {number} index
 */
function MdxParserHelper(reader, nodes, index) {
    this.index = index;
    /** @member {MdxParserNode} */
    this.node = reader.readNode(nodes, this);
    /** @member {number} */
    this.size = this.node.size;
}

export default MdxParserHelper;
