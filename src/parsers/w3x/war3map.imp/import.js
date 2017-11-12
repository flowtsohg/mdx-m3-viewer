/**
 * @constructor
 * @param {?BinaryStream} stream 
 */
function Import(stream) {
    this.isCustom = 0;
    this.name = '';

    if (stream) {
        this.load(stream);
    }
}

Import.prototype = {
    /**
     * @param {BinaryStream} stream 
     */
    load(stream) {
        this.isCustom = stream.readUint8();
        this.name = stream.readUntilNull();
    },

    /**
     * @param {BinaryStream} stream 
     */
    save(stream) {
        stream.writeUint8(this.isCustom);
        stream.write(`${this.name}\0`)
    },

    /**
     * @returns {number}
     */
    calcSize() {
        return 2 + this.name.length;
    }
}

export default Import;
