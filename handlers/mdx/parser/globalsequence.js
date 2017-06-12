/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {number} index
 */
function MdxParserGlobalSequence(reader, index) {
    this.index = index;
    this.value = reader.readUint32();
}
