/**
 * @constructor
 */
function MdxParserModelChunk(reader, tag, size, nodes) {
    this.name = reader.read(80);
    this.animationPath = reader.read(260);
    this.extent = new MdxParserExtent(reader);
    this.blendTime = reader.readUint32();
}
