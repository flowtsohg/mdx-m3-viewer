/**
 * @constructor
 */
function MdxParserGlobalSequence(reader, index) {
    this.index = index;
    this.value = reader.readUint32();
}
