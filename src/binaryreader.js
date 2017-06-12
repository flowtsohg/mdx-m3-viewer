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

    this.buffer = buffer;
    this.dataView = new DataView(buffer, byteOffset, byteLength);
    this.uint8array = new Uint8Array(buffer, byteOffset, byteLength);
    this.index = 0;
    this.byteLength = buffer.byteLength;
}

BinaryReader.prototype = {
    subreader(byteLength) {
        return new BinaryReader(this.buffer, this.index, byteLength);
    },

    remaining() {
        return this.byteLength - this.index;
    },

    skip(bytes) {
        this.index += bytes;
    },

    seek(index) {
        this.index = index;
    },

    tell() {
        return this.index;
    },

    peek(size) {
        let uint8array = this.uint8array,
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

    read(size) {
        // If the size isn't specified, default to everything
        size = size || this.remaining();

        let data = this.peek(size);

        this.index += size;

        return data;
    },

    peekUntilNull() {
        let uint8array = this.uint8array,
            index = this.index,
            data = "",
            b = uint8array[index],
            i = 0;

        while (b !== 0) {
            data += String.fromCharCode(b);

            b = uint8array[index + i]
            i += 1;
        }

        return data;
    },

    readUntilNull() {
        let data = this.peekUntilNull();

        this.index += data.length + 1; // +1 for the \0 itself

        return data;
    },

    peekCharArray(size) {
        let uint8array = this.uint8array,
            index = this.index,
            data = [];

        for (let i = 0; i < size; i++) {
            data[i] = String.fromCharCode(uint8array[index + i]);
        }

        return data;
    },

    readCharArray(size) {
        // If the size isn't specified, default to everything
        size = size || (this.byteLength - this.index);

        let data = this.peekCharArray(size);

        this.index += size;

        return data;
    },

    readInt8() {
        let data = this.dataView.getInt8(this.index, true);

        this.index += 1;

        return data;
    },

    readInt16() {
        let data = this.dataView.getInt16(this.index, true);

        this.index += 2;

        return data;
    },

    readInt32() {
        let data = this.dataView.getInt32(this.index, true);

        this.index += 4;

        return data;
    },

    readUint8() {
        let data = this.dataView.getUint8(this.index, true);

        this.index += 1;

        return data;
    },

    readUint16() {
        let data = this.dataView.getUint16(this.index, true);

        this.index += 2;

        return data;
    },

    readUint32() {
        let data = this.dataView.getUint32(this.index, true);

        this.index += 4;

        return data;
    },

    readFloat32() {
        let data = this.dataView.getFloat32(this.index, true);

        this.index += 4;

        return data;
    },

    readFloat64() {
        let data = this.dataView.getFloat64(this.index, true);

        this.index += 8;

        return data;
    },

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

    readInt8Matrix(rows, columns) {
        let data = [];

        for (let i = 0; i < rows; i++) {
            data[i] = this.readInt8Array(columns);
        }

        return data;
    },

    readInt16Matrix(rows, columns) {
        let data = [];

        for (let i = 0; i < rows; i++) {
            data[i] = this.readInt16Array(columns);
        }

        return data;
    },

    readInt32Matrix(rows, columns) {
        let data = [];

        for (let i = 0; i < rows; i++) {
            data[i] = this.readInt32Array(columns);
        }

        return data;
    },

    readUint8Matrix(rows, columns) {
        let data = [];

        for (let i = 0; i < rows; i++) {
            data[i] = this.readUint8Array(columns);
        }

        return data;
    },

    readUint16Matrix(rows, columns) {
        let data = [];

        for (let i = 0; i < rows; i++) {
            data[i] = this.readUint16Array(columns);
        }

        return data;
    },

    readUint32Matrix(rows, columns) {
        let data = [];

        for (let i = 0; i < rows; i++) {
            data[i] = this.readUint32Array(columns);
        }

        return data;
    },

    readFloat32Matrix(rows, columns) {
        let data = [];

        for (let i = 0; i < rows; i++) {
            data[i] = this.readFloat32Array(columns);
        }

        return data;
    },

    readFloat64Matrix(rows, columns) {
        let data = [];

        for (let i = 0; i < rows; i++) {
            data[i] = this.readFloat64Array(columns);
        }

        return data;
    }
};
