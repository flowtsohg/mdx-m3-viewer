/**
 * @constructor
 */
function MdxParserGeosetAnimation(reader, nodes, index) {
    this.index = index;
    this.size = reader.readUint32();
    this.alpha = reader.readFloat32();
    this.flags = reader.readUint32();
    this.color = reader.readFloat32Array(3);
    this.geosetId = reader.readInt32();
    this.tracks = new MdxParserSDContainer(reader, this.size - 28);
}
