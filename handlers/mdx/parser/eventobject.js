/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxParserNode>} nodes
 * @param {number} index
 */
function MdxParserEventObject(reader, nodes, index) {
    this.index = index;
    /** @member {MdxParserNode} */
    this.node = reader.readNode(nodes, this);

    reader.skip(4); // KEVT

    var count = reader.readUint32();

    /** @member {number} */
    this.globalSequenceId = reader.readInt32();
    /** @member {Uint32Array} */
    this.tracks = reader.readUint32Array(count);
    /** @member {number} */
    this.size = this.node.size + 12 + count * 4;
}
