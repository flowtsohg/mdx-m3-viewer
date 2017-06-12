/**
 * @constructor
 */
function M3ParserBoundingSphere(reader) {
    this.min = reader.readFloat32Array(3);
    this.max = reader.readFloat32Array(3);
    this.radius = reader.readFloat32();
}
