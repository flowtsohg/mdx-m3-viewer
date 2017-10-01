import M3ParserReference from "./reference";

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserSd(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {M3ParserReference} */
    this.keys = new M3ParserReference(reader, index);
    /** @member {number} */
    this.flags = reader.readUint32();
    /** @member {number} */
    this.biggestKey = reader.readUint32();
    /** @member {M3ParserReference} */
    this.values = new M3ParserReference(reader, index);
}

export default M3ParserSd;
