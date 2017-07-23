import MdxParserLayer from "./layer";

/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxParserNode>} nodes
 * @param {number} index
 */
function MdxParserMaterial(reader, nodes, index) {
    this.index = index;
    /** @member {number} */
    this.size = reader.readUint32();
    /** @member {number} */
    this.priorityPlane = reader.readInt32();
    /** @member {number} */
    this.flags = reader.readUint32();

    reader.skip(4); // LAYS

    /** @member {Array<MdxParserLayer>} */
    this.layers = reader.readKnownElements(reader.readUint32(), MdxParserLayer);
}

export default MdxParserMaterial;
