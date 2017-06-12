/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxNode>} nodes
 * @param {number} index
 */
function MdxParserEventObject(reader, nodes, index) {
    this.index = index;
    this.node = reader.readNode(nodes, this);

    reader.skip(4); // KEVT

    var count = reader.readUint32();

    this.globalSequenceId = reader.readInt32();
    this.tracks = reader.readUint32Array(count);
    this.size = this.node.size + 12 + count * 4;
}
