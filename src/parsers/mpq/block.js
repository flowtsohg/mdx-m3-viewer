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
    load(typedArray) {
        this.offset = typedArray[0];
        this.compressedSize = typedArray[1];
        this.normalSize = typedArray[2];
        this.flags = typedArray[3];
    },

    save(typedArray) {
        typedArray[0] = this.offset;
        typedArray[1] = this.compressedSize;
        typedArray[2] = this.normalSize;
        typedArray[3] = this.flags;
    }
};

export default MpqBlock;
