/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxNode>} nodes
 * @param {number} index
 */
function MdxParserCamera(reader, nodes, index) {
    this.index = index;
    this.size = reader.readUint32();
    this.name = reader.read(80);
    this.position = reader.readFloat32Array(3);
    this.fieldOfView = reader.readFloat32();
    this.farClippingPlane = reader.readFloat32();
    this.nearClippingPlane = reader.readFloat32();
    this.targetPosition = reader.readFloat32Array(3);
    this.tracks = new MdxParserSDContainer(reader, this.size - 120);
}
