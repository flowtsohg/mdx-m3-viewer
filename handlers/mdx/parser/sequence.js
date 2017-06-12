/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {number} index
 */
function MdxParserSequence(reader, index) {
    this.index = index;
    this.name = reader.read(80);
    this.interval = reader.readUint32Array(2);
    this.moveSpeed = reader.readFloat32();
    this.flags = reader.readUint32();
    this.rarity = reader.readFloat32();
    this.syncPoint = reader.readUint32();
    this.extent = new MdxParserExtent(reader);
}
