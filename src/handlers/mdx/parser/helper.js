import { readNode } from "./common";

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {Array<MdxNode>} nodes
 * @param {number} index
 */
function MdxParserHelper(reader, nodes, index) {
    this.index = index;
    /** @member {MdxParserNode} */
    this.node = readNode(reader, nodes, this);
    /** @member {number} */
    this.size = this.node.size;
}

export default MdxParserHelper;
