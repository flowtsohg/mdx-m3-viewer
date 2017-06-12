/**
 * @constructor
 */
function MdxParserCamera(reader, nodes, index) {
    this.index = index;
    this.size = reader.readUint32();
    this.name = reader.read(80);
    this.position = reader.readVector3();
    this.fieldOfView = reader.readFloat32();
    this.farClippingPlane = reader.readFloat32();
    this.nearClippingPlane = reader.readFloat32();
    this.targetPosition = reader.readVector3();
    this.tracks = new MdxParserSDContainer(reader, this.size - 120);
}
