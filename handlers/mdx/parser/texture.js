/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {number} index
 */
function MdxParserTexture(reader, index) {
    this.index = index;
    this.replaceableId = reader.readUint32();
    this.path = reader.read(260);
    this.flags = reader.readUint32();
}
