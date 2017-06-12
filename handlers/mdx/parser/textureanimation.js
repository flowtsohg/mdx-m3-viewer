/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxNode>} nodes
 * @param {number} index
 */
function MdxParserTextureAnimation(reader, nodes, index) {
    this.index = index;
    this.size = reader.readUint32();
    this.tracks = new MdxParserSDContainer(reader, this.size - 4);
}
