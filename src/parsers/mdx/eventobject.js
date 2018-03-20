import { readNode } from './common';

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {Array<MdxParserNode>} nodes
 */
function MdxParserEventObject(reader, nodes) {
    /** @member {MdxParserNode} */
    this.node = readNode(reader, nodes, this);

    reader.skip(4); // KEVT

    var count = reader.readUint32();

    /** @member {number} */
    this.globalSequenceId = reader.readInt32();
    /** @member {Uint32Array} */
    this.tracks = reader.readUint32Array(count);
    /** @member {number} */
    this.size = this.node.size + 12 + count * 4;
}

export default MdxParserEventObject;
