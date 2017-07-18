import MdxParserSDContainer from "./sd";

/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxParserNode>} nodes
 * @param {number} index
 */
function MdxParserAttachment(reader, nodes, index) {
    this.index = index;
    /** @member {number} */
    this.size = reader.readUint32();
    /** @member {MdxParserNode} */
    this.node = reader.readNode(nodes, this);
    /** @member {string} */
    this.path = reader.read(260);
    /** @member {number} */
    this.attachmentId = reader.readUint32();
    /** @member {MdxParserSDContainer} */
    this.tracks = new MdxParserSDContainer(reader, this.size - this.node.size - 268);
}

export default MdxParserAttachment;
