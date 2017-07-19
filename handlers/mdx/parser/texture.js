/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {number} index
 */
function MdxParserTexture(reader, index) {
    this.index = index;
    /** @member {number} */
    this.replaceableId = reader.readUint32();
    /** @member {string} */
    this.path = reader.read(260);
    /** @member {number} */
    this.flags = reader.readUint32();
}

export default MdxParserTexture;
