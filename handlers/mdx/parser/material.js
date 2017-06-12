/**
 * @constructor
 */
function MdxParserMaterial(reader, nodes, index) {
    this.index = index;
    this.size = reader.readUint32();
    this.priorityPlane = reader.readInt32();
    this.flags = reader.readUint32();
    reader.skip(4); // LAYS
    this.layers = reader.readKnownElements(reader.readUint32(), MdxParserLayer);
}
