/**
 * @constructor
 */
function MpqBlock() {
    /** @param {number} */
    this.offset = 0;
    /** @param {number} */
    this.compressedSize = 0;
    /** @param {number} */
    this.normalSize = 0;
    /** @param {number} */
    this.flags = 0;
}

MpqBlock.prototype = {
    load(reader) {
        this.offset = reader.readUint32();
        this.compressedSize = reader.readUint32();
        this.normalSize = reader.readUint32();
        this.flags = reader.readUint32();
    },

    save(writer) {
        writer.writeUint32(this.offset);
        writer.writeUint32(this.compressedSize);
        writer.writeUint32(this.normalSize);
        writer.writeUint32(this.flags);
    }
};

export default MpqBlock;
