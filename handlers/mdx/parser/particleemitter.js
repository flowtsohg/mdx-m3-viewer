/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxNode>} nodes
 * @param {number} index
 */
function MdxParserParticleEmitter(reader, nodes, index) {
    this.index = index;
    this.size = reader.readUint32();
    this.node = reader.readNode(nodes, this);
    this.emissionRate = reader.readFloat32();
    this.gravity = reader.readFloat32();
    this.longitude = reader.readFloat32();
    this.latitude = reader.readFloat32();
    this.path = reader.read(260);
    this.lifespan = reader.readFloat32();
    this.speed = reader.readFloat32();
    this.tracks = new MdxParserSDContainer(reader, this.size - this.node.size - 288);
}
