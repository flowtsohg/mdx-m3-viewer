import { readNode } from "./common";

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {Array<MdxParserNode>} nodes
 * @param {number} index
 */
function MdxParserBone(reader, nodes, index) {
    this.index = index;
    /** @member {MdxParserNode} */
    this.node = readNode(reader, nodes, this);
    /** @member {number} */
    this.geosetId = reader.readInt32(); // Unsure if this is correct. What does it even mean for a bone to reference a geoset?
    /** @member {number} */
    this.geosetAnimationId = reader.readInt32(); // Unsure if this is correct. What does it even mean for a bone to reference a geoset animation?
    /** @member {number} */
    this.size = this.node.size + 8;
}

export default MdxParserBone;
