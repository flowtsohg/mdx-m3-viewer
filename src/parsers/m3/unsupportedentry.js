export default class M3ParserUnsupportedEntry {
    /**
     * @see This is used for entries that have known structures (or at least sizes), but this parser isn't going to actually parse.
            The entry will contain its own reader and version, in case the client code wants to do anything with it.
    * @param {BinaryReader} reader
    * @param {number} version
    * @param {Array<M3ParserIndexEntry>} index
    */
    constructor(reader, version, index) {
        /** @member {BinaryReader} */
        this.reader = reader;
        /** @member {number} */
        this.version = version;
        /** @member {Array<M3ParserIndexEntry>} */
        this.index = index;
    }
};
