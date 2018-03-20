import MdxParserSDContainer from './sd';

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {Array<MdxParserNode>} nodes
 */
function MdxParserTextureAnimation(reader, nodes) {
    /** @member {number} */
    this.size = reader.readUint32();
    /** @member {MdxParserSDContainer} */
    this.tracks = new MdxParserSDContainer(reader, this.size - 4);
}

export default MdxParserTextureAnimation;
