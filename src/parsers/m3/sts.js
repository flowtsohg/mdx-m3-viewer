import M3ParserReference from './reference';

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserSts(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {M3ParserReference} */
    this.animIds = new M3ParserReference(reader, index);

    reader.skip(16); // ?
}

export default M3ParserSts;
