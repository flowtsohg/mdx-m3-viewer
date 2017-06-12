/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserSequence(reader, version, index) {
    this.version = version;

    reader.skip(8); // ?

    this.name = new M3ParserReference(reader, index);
    this.interval = reader.readUint32Array(2);
    this.movementSpeed = reader.readFloat32();
    this.flags = reader.readUint32();
    this.frequency = reader.readUint32();

    reader.skip(12); // ?

    if (version < 2) {
        reader.skip(4); // ?
    }

    this.boundingSphere = new M3ParserBoundingSphere(reader);

    reader.skip(12); // ?
}
