/**
 * @constructor
 */
function MdxParserPivotPoint(reader, index) {
    this.index = index;
    this.value = reader.readFloat32Array(3);
}
