import { readNode } from './common';

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {Array<MdxParserNode>} nodes
 */
function MdxParserBone(reader, nodes) {
    /** @member {MdxParserNode} */
    this.node = readNode(reader, nodes, this);
    /** @member {number} */
    this.geosetId = reader.readInt32();
    /** @member {number} */
    this.geosetAnimationId = reader.readInt32();
    /** @member {number} */
    this.size = this.node.size + 8;
}

export default MdxParserBone;
