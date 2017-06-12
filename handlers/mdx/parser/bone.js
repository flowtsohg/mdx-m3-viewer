/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxNode>} nodes
 * @param {number} index
 */
function MdxParserBone(reader, nodes, index) {
    this.node = reader.readNode(nodes, this);
    this.geosetId = reader.readInt32(); // Unsure if this is correct. What does it even mean for a bone to reference a geoset?
    this.geosetAnimationId = reader.readInt32(); // Unsure if this is correct. What does it even mean for a bone to reference a geoset animation?
    this.size = this.node.size + 8;
}
