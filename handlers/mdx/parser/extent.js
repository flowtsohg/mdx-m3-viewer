/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 */
function MdxParserExtent(reader) {
    this.radius = reader.readFloat32();
    this.min = reader.readFloat32Array(3);
    this.max = reader.readFloat32Array(3);
}
