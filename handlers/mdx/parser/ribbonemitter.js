/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxNode>} nodes
 * @param {number} index
 */
function MdxParserRibbonEmitter(reader, nodes, index) {
    this.index = index;
    this.size = reader.readUint32();
    this.node = reader.readNode(nodes, this);
    this.heightAbove = reader.readFloat32();
    this.heightBelow = reader.readFloat32();
    this.alpha = reader.readFloat32();
    this.color = reader.readFloat32Array(3);
    this.lifespan = reader.readFloat32();
    this.textureSlot = reader.readUint32();
    this.emissionRate = reader.readUint32();
    this.rows = reader.readUint32();
    this.columns = reader.readUint32();
    this.materialId = reader.readUint32();
    this.gravity = reader.readFloat32();
    this.tracks = new MdxParserSDContainer(reader, this.size - this.node.size - 56);
}
