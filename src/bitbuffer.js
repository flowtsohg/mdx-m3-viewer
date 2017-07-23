/**
 * @constructor
 * @param {ArrayBuffer} buffer
 * @param {number=} byteOffset
 * @param {number=} byteLength
 */
function BitBuffer(buffer, byteOffset, byteLength) {
    if (!(buffer instanceof ArrayBuffer)) {
        throw new TypeError("BitBuffer: expected ArrayBuffer, got " + buffer);
    }

    // Note: These four lines exist just for Firefox, since, at the time of writing, its implementation fails ECMAScript 2015 section 22.2.1.5 step 13.
    //       In other words, if you create a typed array with byteLength of undefined, the typed array will have zero length, instead of buffer.byteLength - byteOffset.
    //       See bug report at https://bugzilla.mozilla.org/show_bug.cgi?id=1040402
    byteOffset = byteOffset || 0;
    if (byteLength === undefined) {
        byteLength = buffer.byteLength - byteOffset;
    }

    this.buffer = buffer;
    this.byteArray = new Uint8Array(buffer, byteOffset, byteLength);
    this.index = 0;
    this.byteLength = buffer.byteLength;
    this.bitBuffer = 0;
    this.bits = 0;
}

BitBuffer.prototype = {
    /**
     * Peek a number of bits
     * 
     * @param {number} bits
     * @returns {number}
     */
    peekBits(bits) {
        this.loadBits(bits);

        return (this.bitBuffer & (1 << bits));
    },

    /**
     * Read a number of bits
     * 
     * @param {number} bits
     * @returns {number}
     */
    readBits(bits) {
        let data = this.peekBits(bits);

        this.bitBuffer >>>= bits;
        this.bits -= bits;

        return data;
    },

    /**
     * Skip a number of bits
     * 
     * @param {number} bits
     * @returns {number}
     */
    skipBits(bits) {
        this.loadBits(bits);

        this.bitBuffer >>>= bits;
        this.bits -= bits;
    },

    // Load more buts into the buffer
    loadBits(bits) {
        while (this.bits < bits) {
            this.bitBuffer += this.byteArray[this.index] << this.bits;
            this.bits += 8;
            this.index += 1;
        }
    }
};

export default BitBuffer;
