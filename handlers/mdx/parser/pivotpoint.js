/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {number} index
 */
function MdxParserPivotPoint(reader, index) {
    this.index = index;
    /** @member {Float32Array} */
    this.value = reader.readFloat32Array(3);
}
