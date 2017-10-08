/**
 * @constructor
 */
function MpqHash() {
    /** @param {number} */
    this.nameA = 0xFFFFFFFF;
    /** @param {number} */
    this.nameB = 0xFFFFFFFF;
    /** @param {number} */
    this.locale = 0xFFFF;
    /** @param {number} */
    this.platform = 0xFFFF;
    /** @param {number} */
    this.blockIndex = 0xFFFFFFFF;
}

MpqHash.prototype = {
    load(reader) {
        this.nameA = reader.readUint32();
        this.nameB = reader.readUint32();
        this.locale = reader.readUint16();
        this.platform = reader.readUint16();
        this.blockIndex = reader.readUint32();
    },

    copy(hash) {
        this.nameA = hash.nameA;
        this.nameB = hash.nameB;
        this.locale = hash.locale;
        this.platform = hash.platform;
        this.blockIndex = hash.blockIndex;
    },

    save(writer) {
        writer.writeUint32(this.nameA);
        writer.writeUint32(this.nameB);
        writer.writeUint16(this.locale);
        writer.writeUint16(this.platform);
        writer.writeUint32(this.blockIndex);
    }
};

export default MpqHash;
