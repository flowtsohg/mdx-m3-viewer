/**
 * @constructor
 * @param {BinaryReader} reader
 */
function MdxParserExtent(reader) {
    /** @member {number} */
    this.radius = reader.readFloat32();
    /** @member {Float32Array} */
    this.min = reader.readFloat32Array(3);
    /** @member {Float32Array} */
    this.max = reader.readFloat32Array(3);
}

export default MdxParserExtent;
