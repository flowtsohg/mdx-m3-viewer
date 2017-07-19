/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {number} index
 */
function MdxParserGlobalSequence(reader, index) {
    this.index = index;
    /** @member {number} */
    this.value = reader.readUint32();
}

export default MdxParserGlobalSequence;
