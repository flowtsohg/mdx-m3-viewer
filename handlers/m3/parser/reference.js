/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserReference(reader, index) {
    this.index = index;
    this.entries = reader.readUint32();
    this.id = reader.readUint32();
    this.flags = reader.readUint32();
}

M3ParserReference.prototype = {
    getAll() {
        let id = this.id;

        // For empty references (e.g. Layer.imagePath)
        if (id === 0 || this.entries === 0) {
            return [];
        }

        return this.index[id].entries;
    },

    get() {
        return this.getAll()[0];
    }
};
