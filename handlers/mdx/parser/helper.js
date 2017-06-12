/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxNode>} nodes
 * @param {number} index
 */
function MdxParserHelper(reader, nodes, index) {
    this.index = index;
    this.node = reader.readNode(nodes, this);
    this.size = this.node.size;
}
