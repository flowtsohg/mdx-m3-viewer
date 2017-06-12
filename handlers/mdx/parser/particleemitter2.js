/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxNode>} nodes
 * @param {number} index
 */
function MdxParserParticleEmitter2(reader, nodes, index) {
    this.index = index;
    this.size = reader.readUint32();
    this.node = reader.readNode(nodes, this);
    this.speed = reader.readFloat32();
    this.variation = reader.readFloat32();
    this.latitude = reader.readFloat32();
    this.gravity = reader.readFloat32();
    this.lifespan = reader.readFloat32();
    this.emissionRate = reader.readFloat32();
    this.width = reader.readFloat32();
    this.length = reader.readFloat32();
    this.filterMode = reader.readUint32();
    this.rows = reader.readUint32();
    this.columns = reader.readUint32();
    this.headOrTail = reader.readUint32();
    this.tailLength = reader.readFloat32();
    this.timeMiddle = reader.readFloat32();
    this.segmentColor = reader.readFloat32Matrix(3, 3);
    this.segmentAlpha = reader.readUint8Array(3);
    this.segmentScaling = reader.readFloat32Array(3);
    this.headInterval = reader.readUint32Array(3);
    this.headDecayInterval = reader.readUint32Array(3);
    this.tailInterval = reader.readUint32Array(3);
    this.tailDecayInterval = reader.readUint32Array(3);
    this.textureId = reader.readUint32();
    this.squirt = reader.readUint32();
    this.priorityPlane = reader.readUint32();
    this.replaceableId = reader.readUint32();
    this.tracks = new MdxParserSDContainer(reader, this.size - this.node.size - 175);
}
