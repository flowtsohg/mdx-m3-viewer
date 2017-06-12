/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserSTC(reader, version, index) {
    this.version = version;
    this.name = new M3ParserReference(reader, index);
    this.runsConcurrent = reader.readUint16();
    this.priority = reader.readUint16();
    this.stsIndex = reader.readUint16();
    this.stsIndexCopy = reader.readUint16(); // ?
    this.animIds = new M3ParserReference(reader, index);
    this.animRefs = new M3ParserReference(reader, index);

    reader.skip(4); // ?

    this.sd = [
        new M3ParserReference(reader, index),
        new M3ParserReference(reader, index),
        new M3ParserReference(reader, index),
        new M3ParserReference(reader, index),
        new M3ParserReference(reader, index),
        new M3ParserReference(reader, index),
        new M3ParserReference(reader, index),
        new M3ParserReference(reader, index),
        new M3ParserReference(reader, index),
        new M3ParserReference(reader, index),
        new M3ParserReference(reader, index),
        new M3ParserReference(reader, index),
        new M3ParserReference(reader, index)
    ];
}
