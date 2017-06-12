/**
 * @constructor
 */
function MdxParserNode(reader, index, object) {
    this.index = index;
    this.object = object;
    this.size = reader.readUint32();
    this.name = reader.read(80);
    this.objectId = reader.readInt32();
    this.parentId = reader.readInt32();
    this.flags = reader.readUint32();
    this.tracks = new MdxParserSDContainer(reader, this.size - 96);
}
