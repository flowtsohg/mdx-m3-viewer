import M3ParserReference from "./reference";

/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserMd34(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {string} */
    this.tag = reader.read(4).reverse();
    /** @member {number} */
    this.offset = reader.readUint32();
    /** @member {number} */
    this.entries = reader.readUint32();
    /** @member {M3ParserReference} */
    this.model = new M3ParserReference(reader, index);
}

export default M3ParserMd34;
