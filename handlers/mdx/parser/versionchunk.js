/**
 * @constructor
 * @see This is used for chunks that are not supported (e.g. custom chunks injected by authoring tools).
 *      The chunk will contain its own reader, in case the client code wants to do anything with it.
 */
function MdxParserVersionChunk(reader, tag, size, nodes) {
    this.version = reader.readUint32();
}
