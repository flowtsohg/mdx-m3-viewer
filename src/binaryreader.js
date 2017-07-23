/**
 * @constructor
 * @param {ArrayBuffer} buffer
 * @param {number=} byteOffset
 * @param {number=} byteLength
 */
function BinaryReader(buffer, byteOffset, byteLength) {
    if (!(buffer instanceof ArrayBuffer)) {
        throw new TypeError("BinaryReader: expected ArrayBuffer, got " + buffer);
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
    /** @member {DataView} */
    this.dataView = new DataView(buffer, byteOffset, byteLength);
    /** @member {Uint8Array} */
    this.byteArray = new Uint8Array(buffer, byteOffset, byteLength);
    /** @member {number} */
    this.index = 0;
    /** @member {number} */
    this.byteLength = buffer.byteLength;
}

BinaryReader.prototype = {
    /**
     * Create a subreader of this reader, at its position, with the given byte length
     * 
     * @returns {BinaryReader}
     */
    subreader(byteLength) {
        return new BinaryReader(this.buffer, this.index, byteLength);
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
     * Peek a string
     * 
     * @param {number} size
     * @returns {string}
     */
    peek(size) {
        let uint8array = this.byteArray,
            index = this.index,
            data = "";

        for (let i = 0; i < size; i++) {
            let b = uint8array[index + i];

            // Avoid \0
            if (b > 0) {
                data += String.fromCharCode(b);
            }
        }

        return data;
    },

    /**
     * Read a string
     * 
     * @param {number} size
     * @returns {string}
     */
    read(size) {
        // If the size isn't specified, default to everything
        size = size || this.remaining();

        let data = this.peek(size);

        this.index += size;

        return data;
    },

    /**
     * Peeks a string until finding a null byte
     * 
     * @param {number} size
     * @returns {string}
     */
    peekUntilNull() {
        let byteArray = this.byteArray,
            index = this.index,
            data = "",
            b = byteArray[index],
            i = 0;

        while (b !== 0) {
            data += String.fromCharCode(b);

            b = byteArray[index + i]
            i += 1;
        }

        return data;
    },

    /**
     * Read a string until finding a null byte
     * 
     * @param {number} size
     * @returns {string}
     */
    readUntilNull() {
        let data = this.peekUntilNull();

        this.index += data.length + 1; // +1 for the \0 itself

        return data;
    },

    /**
     * Read a 8 bit signed integer
     * 
     * @returns {number}
     */
    readInt8() {
        let data = this.dataView.getInt8(this.index, true);

        this.index += 1;

        return data;
    },

    /**
     * Read a 16 bit signed integer
     * 
     * @returns {number}
     */
    readInt16() {
        let data = this.dataView.getInt16(this.index, true);

        this.index += 2;

        return data;
    },

    /**
     * Read a 32 bit signed integer
     * 
     * @returns {number}
     */
    readInt32() {
        let data = this.dataView.getInt32(this.index, true);

        this.index += 4;

        return data;
    },

    /**
     * Read a 8 bit unsigned integer
     * 
     * @returns {number}
     */
    readUint8() {
        let data = this.dataView.getUint8(this.index, true);

        this.index += 1;

        return data;
    },

    /**
     * Read a 16 bit unsigned integer
     * 
     * @returns {number}
     */
    readUint16() {
        let data = this.dataView.getUint16(this.index, true);

        this.index += 2;

        return data;
    },

    /**
     * Read a 32 bit unsigned integer
     * 
     * @returns {number}
     */
    readUint32() {
        let data = this.dataView.getUint32(this.index, true);

        this.index += 4;

        return data;
    },

    /**
     * Read a 32 bit float
     * 
     * @returns {number}
     */
    readFloat32() {
        let data = this.dataView.getFloat32(this.index, true);

        this.index += 4;

        return data;
    },

    /**
     * Read a 64 bit float
     * 
     * @returns {number}
     */
    readFloat64() {
        let data = this.dataView.getFloat64(this.index, true);

        this.index += 8;

        return data;
    },

    /**
     * Read an array of 8 bit signed integers
     * 
     * @param {number} count
     * @returns {Int8Array}
     */
    readInt8Array(count) {
        let data = new Int8Array(count),
            dataView = this.dataView,
            index = this.index;

        for (let i = 0; i < count; i++) {
            data[i] = dataView.getInt8(index + i, true);
        }

        this.index += data.byteLength;

        return data;
    },

    /**
     * Read an array of 16 bit signed integers
     * 
     * @param {number} count
     * @returns {Int16Array}
     */
    readInt16Array(count) {
        let data = new Int16Array(count),
            dataView = this.dataView,
            index = this.index;

        for (let i = 0; i < count; i++) {
            data[i] = dataView.getInt16(index + 2 * i, true);
        }

        this.index += data.byteLength;

        return data;
    },

    /**
     * Read an array of 32 bit signed integers
     * 
     * @param {number} count
     * @returns {Int32Array}
     */
    readInt32Array(count) {
        let data = new Int32Array(count),
            dataView = this.dataView,
            index = this.index;

        for (let i = 0; i < count; i++) {
            data[i] = dataView.getInt32(index + 4 * i, true);
        }

        this.index += data.byteLength;

        return data;
    },

    /**
     * Read an array of 8 bit unsigned integers
     * 
     * @param {number} count
     * @returns {Uint8Array}
     */
    readUint8Array(count) {
        let data = new Uint8Array(count),
            dataView = this.dataView,
            index = this.index;

        for (let i = 0; i < count; i++) {
            data[i] = dataView.getUint8(index + i, true);
        }

        this.index += data.byteLength;

        return data;
    },

    /**
     * Read an array of 16 bit unsigned integers
     * 
     * @param {number} count
     * @returns {Uint16Array}
     */
    readUint16Array(count) {
        let data = new Uint16Array(count),
            dataView = this.dataView,
            index = this.index;

        for (let i = 0; i < count; i++) {
            data[i] = dataView.getUint16(index + 2 * i, true);
        }

        this.index += data.byteLength;

        return data;
    },

    /**
     * Read an array of 32 bit unsigned integers
     * 
     * @param {number} count
     * @returns {Uint32Array}
     */
    readUint32Array(count) {
        let data = new Uint32Array(count),
            dataView = this.dataView,
            index = this.index;

        for (let i = 0; i < count; i++) {
            data[i] = dataView.getUint32(index + 4 * i, true);
        }

        this.index += data.byteLength;

        return data;
    },

    /**
     * Read an array of 32 bit floats
     * 
     * @param {number} count
     * @returns {Float32Array}
     */
    readFloat32Array(count) {
        let data = new Float32Array(count),
            dataView = this.dataView,
            index = this.index;

        for (let i = 0; i < count; i++) {
            data[i] = dataView.getFloat32(index + 4 * i, true);
        }

        this.index += data.byteLength;

        return data;
    },

    /**
     * Read an array of 64 bit floats
     * 
     * @param {number} count
     * @returns {Float64Array}
     */
    readFloat64Array(count) {
        let data = new Float64Array(count),
            dataView = this.dataView,
            index = this.index;

        for (let i = 0; i < count; i++) {
            data[i] = dataView.getFloat64(index + 8 * i, true);
        }

        this.index += data.byteLength;

        return data;
    },

    /**
     * Read an array of arrays of 8 bit signed integers
     * 
     * @param {number} rows
     * @param {number} columns
     * @returns {Array<Int8Array>}
     */
    readInt8Matrix(rows, columns) {
        let data = [];

        for (let i = 0; i < rows; i++) {
            data[i] = this.readInt8Array(columns);
        }

        return data;
    },

    /**
     * Read an array of arrays of 16 bit signed integers
     * 
     * @param {number} rows
     * @param {number} columns
     * @returns {Array<Int16Array>}
     */
    readInt16Matrix(rows, columns) {
        let data = [];

        for (let i = 0; i < rows; i++) {
            data[i] = this.readInt16Array(columns);
        }

        return data;
    },

    /**
     * Read an array of arrays of 32 bit signed integers
     * 
     * @param {number} rows
     * @param {number} columns
     * @returns {Array<Int32Array>}
     */
    readInt32Matrix(rows, columns) {
        let data = [];

        for (let i = 0; i < rows; i++) {
            data[i] = this.readInt32Array(columns);
        }

        return data;
    },

    /**
     * Read an array of arrays of 8 bit unsigned integers
     * 
     * @param {number} rows
     * @param {number} columns
     * @returns {Array<Uint8Array>}
     */
    readUint8Matrix(rows, columns) {
        let data = [];

        for (let i = 0; i < rows; i++) {
            data[i] = this.readUint8Array(columns);
        }

        return data;
    },

    /**
     * Read an array of arrays of 16 bit unsigned integers
     * 
     * @param {number} rows
     * @param {number} columns
     * @returns {Array<Uint16Array>}
     */
    readUint16Matrix(rows, columns) {
        let data = [];

        for (let i = 0; i < rows; i++) {
            data[i] = this.readUint16Array(columns);
        }

        return data;
    },

    /**
     * Read an array of arrays of 32 bit unsigned integers
     * 
     * @param {number} rows
     * @param {number} columns
     * @returns {Array<Uint32Array>}
     */
    readUint32Matrix(rows, columns) {
        let data = [];

        for (let i = 0; i < rows; i++) {
            data[i] = this.readUint32Array(columns);
        }

        return data;
    },

    /**
     * Read an array of arrays of 32 bit floats
     * 
     * @param {number} rows
     * @param {number} columns
     * @returns {Array<Float32Array>}
     */
    readFloat32Matrix(rows, columns) {
        let data = [];

        for (let i = 0; i < rows; i++) {
            data[i] = this.readFloat32Array(columns);
        }

        return data;
    },

    /**
     * Read an array of arrays of 64 bit floats
     * 
     * @param {number} rows
     * @param {number} columns
     * @returns {Array<Float64Array>}
     */
    readFloat64Matrix(rows, columns) {
        let data = [];

        for (let i = 0; i < rows; i++) {
            data[i] = this.readFloat64Array(columns);
        }

        return data;
    }
};

export default BinaryReader;
