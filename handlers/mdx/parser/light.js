/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxNode>} nodes
 * @param {number} index
 */
function MdxParserLight(reader, nodes, index) {
    this.index = index;
    this.size = reader.readUint32();
    this.node = reader.readNode(nodes, this);
    this.type = reader.readUint32();
    this.attenuation = reader.readFloat32Array(2);
    this.color = reader.readFloat32Array(3);
    this.intensity = reader.readFloat32();
    this.ambientColor = reader.readFloat32Array(3);
    this.ambientIntensity = reader.readFloat32();
    this.tracks = new MdxParserSDContainer(reader, this.size - this.node.size - 48);
}
