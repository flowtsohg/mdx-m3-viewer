/**
 * @constructor
 * @param {BinaryReader} reader
 */
function MdxParserGlobalSequence(reader) {
    /** @member {number} */
    this.value = reader.readUint32();
}

export default MdxParserGlobalSequence;
