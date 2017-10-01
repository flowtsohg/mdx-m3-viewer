import MdxParserSDContainer from "./sd";

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {number} index
 * @param {*} object
 */
function MdxParserNode(reader, index, object) {
    this.index = index;
    /** @member {?} */
    this.object = object;
    /** @member {number} */
    this.size = reader.readUint32();
    /** @member {string} */
    this.name = reader.read(80);
    /** @member {number} */
    this.objectId = reader.readInt32();
    /** @member {number} */
    this.parentId = reader.readInt32();
    /** @member {number} */
    this.flags = reader.readUint32();
    /** @member {MdxParserSDContainer} */
    this.tracks = new MdxParserSDContainer(reader, this.size - 96);
}

export default MdxParserNode;
