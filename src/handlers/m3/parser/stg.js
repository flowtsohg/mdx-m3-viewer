import M3ParserReference from "./reference";

/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserStg(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {M3ParserReference} */
    this.name = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.stcIndices = new M3ParserReference(reader, index);
}

export default M3ParserStg;
