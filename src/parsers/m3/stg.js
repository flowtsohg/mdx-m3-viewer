import M3ParserReference from './reference';

export default class M3ParserStg {
    /**
     * @param {BinaryReader} reader
     * @param {number} version
     * @param {Array<M3ParserIndexEntry>} index
     */
    constructor(reader, version, index) {
        /** @member {number} */
        this.version = version;
        /** @member {M3ParserReference} */
        this.name = new M3ParserReference(reader, index);
        /** @member {M3ParserReference} */
        this.stcIndices = new M3ParserReference(reader, index);
    }
};
