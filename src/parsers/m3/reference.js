/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserReference(reader, index) {
    /** @member {Array<M3ParserIndexEntry>} */
    this.index = index;
    /** @member {number} */
    this.entries = reader.readUint32();
    /** @member {number} */
    this.id = reader.readUint32();
    /** @member {number} */
    this.flags = reader.readUint32();
}

M3ParserReference.prototype = {
    /**
     * Get the entries this index entry references.
     * 
     * @returns {Array<?>}
     */
    getAll() {
        let id = this.id;

        // For empty references (e.g. Layer.imagePath)
        if (id === 0 || this.entries === 0) {
            return [];
        }

        return this.index[id].entries;
    },

    /**
     * Get the first entry this index entry references.
     * 
     * @returns {?}
     */
    get() {
        return this.getAll()[0];
    }
};

export default M3ParserReference;
