/**
 * @constructor
 */
function MdxParserAttachment(reader, nodes, index) {
    this.index = index;
    this.size = reader.readUint32();
    this.node = reader.readNode(nodes, this);
    this.path = reader.read(260);
    this.attachmentId = reader.readUint32();
    this.tracks = new MdxParserSDContainer(reader, this.size - this.node.size - 268);
}
