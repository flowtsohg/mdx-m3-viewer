/**
 * @constructor
 * @param {ArrayBuffer} buffer
 * @param {number=} byteOffset
 * @param {number=} byteLength
 */
function BinaryWriter(buffer, byteOffset, byteLength) {
    if (!(buffer instanceof ArrayBuffer)) {
        throw new TypeError(`BinaryWriter: expected ArrayBuffer, got ${buffer}`);
    }

    // Note: These four lines exist just for Firefox, since, at the time of writing, its implementation fails ECMAScript 2015 section 22.2.1.5 step 13.
    //       In other words, if you create a typed array with byteLength of undefined, the typed array will have zero length, instead of buffer.byteLength - byteOffset.
    //       See bug report at https://bugzilla.mozilla.org/show_bug.cgi?id=1040402
    byteOffset = byteOffset || 0;
    if (byteLength === undefined) {
        byteLength = buffer.byteLength - byteOffset;
    }

    /** @member {ArrayBuffer} */
    this.buffer = buffer;
    /** @member {dataview} */
    this.dataview = new DataView(buffer, byteOffset, byteLength);
    /** @member {Uint8Array} */
    this.byteArray = new Uint8Array(buffer, byteOffset, byteLength);
    /** @member {number} */
    this.index = 0;
    /** @member {number} */
    this.byteLength = buffer.byteLength;
}

BinaryWriter.prototype = {
    /**
     * Create a subwriter of this writer, at its position, with the given byte length
     * 
     * @returns {BinaryWriter}
     */
    subwriter(byteLength) {
        return new BinaryWriter(this.buffer, this.index, byteLength);
    },

    /**
     * Get the remaining bytes
     * 
     * @returns {number}
     */
    remaining() {
        return this.byteLength - this.index;
    },

    /**
     * Skip a number of bytes
     * 
     * @param {number} bytes
     */
    skip(bytes) {
        this.index += bytes;
    },

    /**
     * Set the reader's index
     * 
     * @param {number} index
     */
    seek(index) {
        this.index = index;
    },

    /**
     * Get the reader's index
     * 
     * @returns {number}
     */
    tell() {
        return this.index;
    },

    /**
     * Write a string
     * 
     * @param {string} s
     */
    write(s) {
        let uint8array = this.byteArray,
            index = this.index,
            l = s.length;

        for (let i = 0; i < l; i++) {
            uint8array[index + i] = s.charCodeAt(i)
        }

        this.index += l;
    },

    /**
     * Write a 8 bit signed integer
     * 
     * @param {number} value
     */
    writeInt8(value) {
        this.dataview.setInt8(this.index, value, true);
        this.index += 1;
    },

    /**
     * Write a 16 bit signed integer
     * 
     * @param {number} value
     */
    writeInt16(value) {
        this.dataview.setInt16(this.index, value, true);
        this.index += 2;
    },

    /**
     * Write a 32 bit signed integer
     * 
     * @param {number} value
     */
    writeInt32(value) {
        this.dataview.setInt32(this.index, value, true);
        this.index += 4;
    },

    /**
     * Write a 8 bit signed integer
     * 
     * @param {number} value
     */
    writeUint8(value) {
        this.dataview.setUint8(this.index, value, true);
        this.index += 1;
    },

    /**
     * Write a 16 bit signed integer
     * 
     * @param {number} value
     */
    writeUint16(value) {
        this.dataview.setUint16(this.index, value, true);
        this.index += 2;
    },

    /**
     * Write a 32 bit signed integer
     * 
     * @param {number} value
     */
    writeUint32(value) {
        this.dataview.setUint32(this.index, value, true);
        this.index += 4;
    },

    /**
     * Write a 32 bit float
     * 
     * @param {number} value
     */
    writeFloat32(value) {
        this.dataview.setFloat32(this.index, value, true);
        this.index += 4;
    },

    /**
     * Write a 64 bit float
     * 
     * @param {number} value
     */
    writeFloat64(value) {
        this.dataview.setFloat64(this.index, value, true);
        this.index += 8;
    },

    /**
     * Write an array of 8 bit signed integers
     * 
     * @param {Int8Array} data
     */
    writeInt8Array(data) {
        for (let i = 0, l = data.length; i < l; i++) {
            this.dataview.setInt8(this.index + i, data[i], true);
        }

        this.index += data.byteLength;
    },

    /**
     * Write an array of 16 bit signed integers
     * 
     * @param {Int16Array} data
     */
    writeInt16Array(data) {
        for (let i = 0, l = data.length; i < l; i++) {
            this.dataview.setInt16(this.index + i * 2, data[i], true);
        }

        this.index += data.byteLength;
    },

    /**
     * Write an array of 32 bit signed integers
     * 
     * @param {Int32Array} data
     */
    writeInt32Array(data) {
        for (let i = 0, l = data.length; i < l; i++) {
            this.dataview.setInt32(this.index + i * 4, data[i], true);
        }

        this.index += data.byteLength;
    },

    /**
     * Write an array of 8 bit unsigned integers
     * 
     * @param {Uint8Array} data
     */
    writeUint8Array(data) {
        for (let i = 0, l = data.length; i < l; i++) {
            this.dataview.setUint8(this.index + i, data[i], true);
        }

        this.index += data.byteLength;
    },

    /**
     * Write an array of 16 bit unsigned integers
     * 
     * @param {Uint16Array} data
     */
    writeUint16Array(data) {
        for (let i = 0, l = data.length; i < l; i++) {
            this.dataview.setUint16(this.index + i * 2, data[i], true);
        }

        this.index += data.byteLength;
    },

    /**
     * Write an array of 32 bit unsigned integers
     * 
     * @param {Uint32Array} data
     */
    writeUint32Array(data) {
        for (let i = 0, l = data.length; i < l; i++) {
            this.dataview.setUint32(this.index + i * 4, data[i], true);
        }

        this.index += data.byteLength;
    },

    /**
     * Write an array of 32 bit floats
     * 
     * @param {Float32Array} data
     */
    writeFloat32Array(data) {
        for (let i = 0, l = data.length; i < l; i++) {
            this.dataview.setFloat32(this.index + i * 4, data[i], true);
        }

        this.index += data.byteLength;
    },

    /**
     * Write an array of 64 bit floats
     * 
     * @param {Float64Array} data
     */
    writeFloat64Array(data) {
        for (let i = 0, l = data.length; i < l; i++) {
            this.dataview.setFloat64(this.index + i * 8, data[i], true);
        }

        this.index += data.byteLength;
    },

    /**
     * Write an array of arrays of 8 bit signed integers
     * 
     * @param {Array<Int8Array>} data
     */
    writeInt8Matrix(data) {
        for (let i = 0, l = data.length; i < l; i++) {
            this.writeInt8Array(data[i]);
        }
    },

    /**
     * Write an array of arrays of 16 bit signed integers
     * 
     * @param {Array<Int16Array>} data
     */
    writeInt16Matrix(data) {
        for (let i = 0, l = data.length; i < l; i++) {
            this.writeInt16Array(data[i]);
        }
    },

    /**
     * Write an array of arrays of 32 bit signed integers
     * 
     * @param {Array<Int32Array>} data
     */
    writeInt32Matrix(data) {
        for (let i = 0, l = data.length; i < l; i++) {
            this.writeInt32Array(data[i]);
        }
    },

    /**
     * Write an array of arrays of 8 bit unsigned integers
     * 
     * @param {Array<Uint8Array>} data
     */
    writeUint8Matrix(data) {
        for (let i = 0, l = data.length; i < l; i++) {
            this.writeUint8Array(data[i]);
        }
    },

    /**
     * Write an array of arrays of 16 bit unsigned integers
     * 
     * @param {Array<Uint16Array>} data
     */
    writeUint16Matrix(data) {
        for (let i = 0, l = data.length; i < l; i++) {
            this.writeUint16Array(data[i]);
        }
    },

    /**
     * Write an array of arrays of 32 bit unsigned integers
     * 
     * @param {Array<Uint32Array>} data
     */
    writeUint32Matrix(data) {
        for (let i = 0, l = data.length; i < l; i++) {
            this.writeUint32Array(data[i]);
        }
    },

    /**
     * Write an array of arrays of 32 bit floats
     * 
     * @param {Array<Float32Array>} data
     */
    writeFloat32Matrix(data) {
        for (let i = 0, l = data.length; i < l; i++) {
            this.writeFloat32Array(data[i]);
        }
    },

    /**
     * Write an array of arrays of 64 bit floats
     * 
     * @param {Array<Float64Array>} data
     */
    writeFloat64Matrix(data) {
        for (let i = 0, l = data.length; i < l; i++) {
            this.writeFloat64Array(data[i]);
        }
    }
};

export default BinaryWriter;
