import MdxParserSDContainer from "./sd";

/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxParserNode>} nodes
 * @param {number} index
 */
function MdxParserTextureAnimation(reader, nodes, index) {
    this.index = index;
    /** @member {number} */
    this.size = reader.readUint32();
    /** @member {MdxParserSDContainer} */
    this.tracks = new MdxParserSDContainer(reader, this.size - 4);
}

export default MdxParserTextureAnimation;
