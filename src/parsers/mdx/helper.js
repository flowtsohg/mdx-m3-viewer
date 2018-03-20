import { readNode } from './common';

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {Array<MdxNode>} nodes
 */
function MdxParserHelper(reader, nodes) {
    /** @member {MdxParserNode} */
    this.node = readNode(reader, nodes, this);
    /** @member {number} */
    this.size = this.node.size;
}

export default MdxParserHelper;
