/**
 * @constructor
 * @param {BinaryReader} reader
 */
function MdxParserPivotPoint(reader) {
    /** @member {Float32Array} */
    this.value = reader.readFloat32Array(3);
}

export default MdxParserPivotPoint;
