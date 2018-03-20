import { readNode } from './common';
import MdxParserSDContainer from './sd';

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {Array<MdxParserNode>} nodes
 */
function MdxParserAttachment(reader, nodes) {
    /** @member {number} */
    this.size = reader.readUint32();
    /** @member {MdxParserNode} */
    this.node = readNode(reader, nodes, this);
    /** @member {string} */
    this.path = reader.read(260);
    /** @member {number} */
    this.attachmentId = reader.readUint32();
    /** @member {MdxParserSDContainer} */
    this.tracks = new MdxParserSDContainer(reader, this.size - this.node.size - 268);
}

export default MdxParserAttachment;
