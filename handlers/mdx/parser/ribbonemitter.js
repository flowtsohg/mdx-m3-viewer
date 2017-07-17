/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxParserNode>} nodes
 * @param {number} index
 */
function MdxParserRibbonEmitter(reader, nodes, index) {
    this.index = index;
    /** @member {number} */
    this.size = reader.readUint32();
    /** @member {MdxParserNode} */
    this.node = reader.readNode(nodes, this);
    /** @member {number} */
    this.heightAbove = reader.readFloat32();
    /** @member {number} */
    this.heightBelow = reader.readFloat32();
    /** @member {number} */
    this.alpha = reader.readFloat32();
    /** @member {Float32Array} */
    this.color = reader.readFloat32Array(3);
    /** @member {number} */
    this.lifespan = reader.readFloat32();
    /** @member {number} */
    this.textureSlot = reader.readUint32();
    /** @member {number} */
    this.emissionRate = reader.readUint32();
    /** @member {number} */
    this.rows = reader.readUint32();
    /** @member {number} */
    this.columns = reader.readUint32();
    /** @member {number} */
    this.materialId = reader.readUint32();
    /** @member {number} */
    this.gravity = reader.readFloat32();
    /** @member {MdxParserSDContainer} */
    this.tracks = new MdxParserSDContainer(reader, this.size - this.node.size - 56);
}
