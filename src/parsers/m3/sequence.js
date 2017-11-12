import M3ParserReference from './reference';
import M3ParserBoundingSphere from './boundingsphere';

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserSequence(reader, version, index) {
    /** @member {number} */
    this.version = version;

    reader.skip(8); // ?

    /** @member {M3ParserReference} */
    this.name = new M3ParserReference(reader, index);
    /** @member {Uint32Array} */
    this.interval = reader.readUint32Array(2);
    /** @member {number} */
    this.movementSpeed = reader.readFloat32();
    /** @member {number} */
    this.flags = reader.readUint32();
    /** @member {number} */
    this.frequency = reader.readUint32();

    reader.skip(12); // ?

    if (version < 2) {
        reader.skip(4); // ?
    }

    /** @member {M3ParserBoundingSphere} */
    this.boundingSphere = new M3ParserBoundingSphere(reader);

    reader.skip(12); // ?
}

export default M3ParserSequence;
