import M3ParserReference from './reference';
import reverse from '../../common/stringreverse';

export default class M3ParserMd34 {
    /**
     * @param {BinaryReader} reader
     * @param {number} version
     * @param {Array<M3ParserIndexEntry>} index
     */
    constructor(reader, version, index) {
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
};
