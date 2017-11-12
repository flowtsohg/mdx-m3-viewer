import M3ParserReference from './reference';
import reverse from '../../common/stringreverse';

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserMd34(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {string} */
    this.tag = reverse(reader.read(4));
    /** @member {number} */
    this.offset = reader.readUint32();
    /** @member {number} */
    this.entries = reader.readUint32();
    /** @member {M3ParserReference} */
    this.model = new M3ParserReference(reader, index);
}

export default M3ParserMd34;
