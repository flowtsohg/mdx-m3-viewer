import { readKnownElements } from './common';
import MdxParserLayer from './layer';

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {Array<MdxParserNode>} nodes
 */
function MdxParserMaterial(reader, nodes) {
    /** @member {number} */
    this.size = reader.readUint32();
    /** @member {number} */
    this.priorityPlane = reader.readInt32();
    /** @member {number} */
    this.flags = reader.readUint32();

    reader.skip(4); // LAYS

    /** @member {Array<MdxParserLayer>} */
    this.layers = readKnownElements(reader, reader.readUint32(), MdxParserLayer);
}

export default MdxParserMaterial;
