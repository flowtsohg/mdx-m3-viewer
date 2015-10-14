/**
 * A simple binary reader.
 *
 * @class BinaryReader
 * @param {ArrayByffer} buffer The internal buffer this reader uses.
 * @property {ArrayBuffer} buffer
 * @property {number} index
 * @property {DataView} dataview
 * @property {Uint8Array} uint8Array
 * @property {number} size
 */
function BinaryReader(buffer) {
    this.buffer = buffer;
    this.index = 0;
    this.dataview = new DataView(buffer);
    this.uint8Array = new Uint8Array(buffer);
    this.size = buffer.byteLength;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @returns {number} The remaining bytes.
 */
function remaining(reader) {
    return reader.size - reader.index;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} bytes Bytes to skip.
 */
function skip(reader, bytes) {
    reader.index += bytes;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} index Where to seek to.
 */
function seek(reader, index) {
    reader.index = index;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @return {number} The reader's position.
 */
function tell(reader) {
    return reader.index;
}

/**
 * Reads a string, but does not advance the reader's position.
 *
 * @param {BinaryReader} reader Binary reader.
 * @param {number} size Number of bytes to read.
 * @return {string} The read string.
 */
function peek(reader, size) {
    var bytes = reader.uint8Array.subarray(reader.index, reader.index + size),
        b,
        data = "";

    for (var i = 0, l = size; i < l; i++) {
        b = bytes[i];

        // Avoid \0
        if (b > 0) {
            data += String.fromCharCode(b);
        }
    }

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} size Number of bytes to read.
 * @return {string} The read string.
 */
function read(reader, size) {
    var data = peek(reader, size);

    reader.index += size;

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @return {number} The read number.
 */
function readInt8(reader) {
    var data = reader.dataview.getInt8(reader.index, true);

    reader.index += 1;

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @return {number} The read number.
 */
function readInt16(reader) {
    var data = reader.dataview.getInt16(reader.index, true);

    reader.index += 2;

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @return {number} The read number.
 */
function readInt32(reader) {
    var data = reader.dataview.getInt32(reader.index, true);

    reader.index += 4;

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @return {number} The read number.
 */
function readUint8(reader) {
    var data = reader.dataview.getUint8(reader.index, true);

    reader.index += 1;

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @return {number} The read number.
 */
function readUint16(reader) {
    var data = reader.dataview.getUint16(reader.index, true);

    reader.index += 2;

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @return {number} The read number.
 */
function readUint32(reader) {
    var data = reader.dataview.getUint32(reader.index, true);

    reader.index += 4;

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @return {number} The read number.
 */
function readFloat32(reader) {
    var data = reader.dataview.getFloat32(reader.index, true);

    reader.index += 4;

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @return {number} The read number.
 */
function readFloat64(reader) {
    var data = reader.dataview.getFloat64(reader.index, true);

    reader.index += 8;

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} count Array size.
 * @return {Int8Array} The read array.
 */
function readInt8Array(reader, count) {
    var data = new Int8Array(count);

    for (var i = 0; i < count; i++) {
        data[i] = reader.dataview.getInt8(reader.index + i, true);
    }

    reader.index += data.byteLength;

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} count Array size.
 * @return {Int16Array} The read array.
 */
function readInt16Array(reader, count) {
    var data = new Int16Array(count);

    for (var i = 0; i < count; i++) {
        data[i] = reader.dataview.getInt16(reader.index + 2 * i, true);
    }

    reader.index += data.byteLength;

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} count Array size.
 * @return {Int32Array} The read array.
 */
function readInt32Array(reader, count) {
    var data = new Int32Array(count);

    for (var i = 0; i < count; i++) {
        data[i] = reader.dataview.getInt32(reader.index + 4 * i, true);
    }

    reader.index += data.byteLength;

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} count Array size.
 * @return {Uint8Array} The read array.
 */
function readUint8Array(reader, count) {
    var data = new Uint8Array(count);

    for (var i = 0; i < count; i++) {
        data[i] = reader.dataview.getUint8(reader.index + i, true);
    }

    reader.index += data.byteLength;

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} count Array size.
 * @return {Uint16Array} The read array.
 */
function readUint16Array(reader, count) {
    var data = new Uint16Array(count);

    for (var i = 0; i < count; i++) {
        data[i] = reader.dataview.getUint16(reader.index + 2 * i, true);
    }

    reader.index += data.byteLength;

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} count Array size.
 * @return {Uint32Array} The read array.
 */
function readUint32Array(reader, count) {
    var data = new Uint32Array(count);

    for (var i = 0; i < count; i++) {
        data[i] = reader.dataview.getUint32(reader.index + 4 * i, true);
    }

    reader.index += data.byteLength;

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} count Array size.
 * @return {Float32Array} The read array.
 */
function readFloat32Array(reader, count) {
    var data = new Float32Array(count);

    for (var i = 0; i < count; i++) {
        data[i] = reader.dataview.getFloat32(reader.index + 4 * i, true);
    }

    reader.index += data.byteLength;

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} count Array size.
 * @return {Float64Array} The read array.
 */
function readFloat64Array(reader, count) {
    var data = new Float64Array(count);

    for (var i = 0; i < count; i++) {
        data[i] = reader.dataview.getFloat64(reader.index + 8 * i, true);
    }

    reader.index += data.byteLength;

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} count Rows.
 * @param {number} size Columns.
 * @return {array} The read array of Int8Array.
 */
function readInt8Matrix(reader, count, size) {
    var data = [];

    for (var i = 0; i < count; i++) {
        data[i] = readInt8Array(reader, size);
    }

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} count Rows.
 * @param {number} size Columns.
 * @return {array} The read array of Int16Array.
 */
function readInt16Matrix(reader, count, size) {
    var data = [];

    for (var i = 0; i < count; i++) {
        data[i] = readInt16Array(reader, size);
    }

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} count Rows.
 * @param {number} size Columns.
 * @return {array} The read array of Int32Array.
 */
function readInt32Matrix(reader, count, size) {
    var data = [];

    for (var i = 0; i < count; i++) {
        data[i] = readInt32Array(reader, size);
    }

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} count Rows.
 * @param {number} size Columns.
 * @return {array} The read array of Uint8Array.
 */
function readUint8Matrix(reader, count, size) {
    var data = [];

    for (var i = 0; i < count; i++) {
        data[i] = readUint8Array(reader, size);
    }

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} count Rows.
 * @param {number} size Columns.
 * @return {array} The read array of Uint16Array.
 */
function readUint16Matrix(reader, count, size) {
    var data = [];

    for (var i = 0; i < count; i++) {
        data[i] = readUint16Array(reader, size);
    }

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} count Rows.
 * @param {number} size Columns.
 * @return {array} The read array of Uint32Array.
 */
function readUint32Matrix(reader, count, size) {
    var data = [];

    for (var i = 0; i < count; i++) {
        data[i] = readUint32Array(reader, size);
    }

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} count Rows.
 * @param {number} size Columns.
 * @return {array} The read array of Float32Array.
 */
function readFloat32Matrix(reader, count, size) {
    var data = [];

    for (var i = 0; i < count; i++) {
        data[i] = readFloat32Array(reader, size);
    }

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @param {number} count Rows.
 * @param {number} size Columns.
 * @return {array} The read array of Float64Array.
 */
function readFloat64Matrix(reader, count, size) {
    var data = [];

    for (var i = 0; i < count; i++) {
        data[i] = readFloat64Array(reader, size);
    }

    return data;
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @return {Float32Array} The read array.
 */
function readVector2(reader) {
    return readFloat32Array(reader, 2);
}
  
/**
 * @param {BinaryReader} reader Binary reader.
 * @return {Float32Array} The read array.
 */
function readVector3(reader) {
    return readFloat32Array(reader, 3);
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @return {Float32Array} The read array.
 */
function readVector4(reader) {
    return readFloat32Array(reader, 4);
}

/**
 * @param {BinaryReader} reader Binary reader.
 * @return {Float32Array} The read array.
 */
function readMatrix(reader) {
    return readFloat32Array(reader, 16);
}


function writeUint8(reader, value) {
    reader.uint8Array[reader.index] = value;
    reader.index += 1;
}

function writeUint8Array(reader, array) {
    for (var i = 0, l = array.byteLength; i < l; i++) {
        reader.uint8Array[reader.index + i] = array[i];
    }

    reader.index += array.byteLength;
}