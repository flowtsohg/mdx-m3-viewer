/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxParserNode>} nodes
 * @param {number} index
 */
function MdxParserGeosetAnimation(reader, nodes, index) {
    this.index = index;
    /** @member {number} */
    this.size = reader.readUint32();
    /** @member {number} */
    this.alpha = reader.readFloat32();
    /** @member {number} */
    this.flags = reader.readUint32();
    /** @member {number} */
    this.color = reader.readFloat32Array(3);
    /** @member {Float32Array} */
    this.geosetId = reader.readInt32();
    /** @member {MdxParserSDContainer} */
    this.tracks = new MdxParserSDContainer(reader, this.size - 28);
}
