function BinaryReader(buffer) {
    let byteOffset = 0;

    if (ArrayBuffer.isView(buffer)) {
        buffer = buffer.buffer;
        byteOffset = buffer.byteOffset;
    }

    if (!(buffer instanceof ArrayBuffer)) {
        throw "BinaryReader: must construct with an ArrayBuffer object, or a view of one, given " + buffer;
    }

    this.buffer = buffer;
    this.dataview = new DataView(buffer, byteOffset);
    this.uint8array = new Uint8Array(buffer, byteOffset);
    this.index = 0;
    this.byteLength = buffer.byteLength;
}

function subreader(reader, byteLength) {
    return new BinaryReader(reader.uint8array.slice(reader.index, reader.index + byteLength));
}

function remaining(reader) {
    return reader.byteLength - reader.index;
}

function skip(reader, bytes) {
    reader.index += bytes;
}

function seek(reader, index) {
    reader.index = index;
}

function tell(reader) {
    return reader.index;
}

function peek(reader, size) {
    let uint8array = reader.uint8array,
        index = reader.index,
        b,
        data = "";

    for (let i = 0, l = size; i < l; i++) {
        b = uint8array[index + i];

        // Avoid \0
        if (b > 0) {
            data += String.fromCharCode(b);
        }
    }

    return data;
}

function read(reader, size) {
    // If the size isn't specified, default to everything
    size = size || (reader.byteLength - reader.index);

    const data = peek(reader, size);

    reader.index += size;

    return data;
}

function peekUntilNull(reader) {
    let uint8array = reader.uint8array,
        index = reader.index,
        data = "",
        b = uint8array[index],
        i = 0;

    while (b !== 0) {
        data += String.fromCharCode(b);

        b = uint8array[index + i]
        i += 1;
    }

    return data;
}

function readUntilNull(reader) {
    const data = peekUntilNull(reader);

    reader.index += data.length + 1; // +1 for the \0 itself

    return data;
}

function peekCharArray(reader, size) {
    let uint8array = reader.uint8array,
        index = reader.index,
        data = "";

    for (let i = 0, l = size; i < l; i++) {
        data += String.fromCharCode(uint8array[index + i]);
    }

    return data;
}

function readCharArray(reader, size) {
    // If the size isn't specified, default to everything
    size = size || (reader.byteLength - reader.index);

    const data = peekCharArray(reader, size);

    reader.index += size;

    return data;
}

function readInt8(reader) {
    const data = reader.dataview.getInt8(reader.index, true);

    reader.index += 1;

    return data;
}

function readInt16(reader) {
    const data = reader.dataview.getInt16(reader.index, true);

    reader.index += 2;

    return data;
}

function readInt32(reader) {
    const data = reader.dataview.getInt32(reader.index, true);

    reader.index += 4;

    return data;
}

function readUint8(reader) {
    const data = reader.dataview.getUint8(reader.index, true);

    reader.index += 1;

    return data;
}

function readUint16(reader) {
    const data = reader.dataview.getUint16(reader.index, true);

    reader.index += 2;

    return data;
}

function readUint32(reader) {
    const data = reader.dataview.getUint32(reader.index, true);

    reader.index += 4;

    return data;
}

function readFloat32(reader) {
    const data = reader.dataview.getFloat32(reader.index, true);

    reader.index += 4;

    return data;
}

function readFloat64(reader) {
    const data = reader.dataview.getFloat64(reader.index, true);

    reader.index += 8;

    return data;
}

function readInt8Array(reader, count) {
    const data = new Int8Array(count);

    for (let i = 0; i < count; i++) {
        data[i] = reader.dataview.getInt8(reader.index + i, true);
    }

    reader.index += data.byteLength;

    return data;
}

function readInt16Array(reader, count) {
    const data = new Int16Array(count);

    for (let i = 0; i < count; i++) {
        data[i] = reader.dataview.getInt16(reader.index + 2 * i, true);
    }

    reader.index += data.byteLength;

    return data;
}

function readInt32Array(reader, count) {
    const data = new Int32Array(count);

    for (let i = 0; i < count; i++) {
        data[i] = reader.dataview.getInt32(reader.index + 4 * i, true);
    }

    reader.index += data.byteLength;

    return data;
}

function readUint8Array(reader, count) {
    const data = new Uint8Array(count);

    for (let i = 0; i < count; i++) {
        data[i] = reader.dataview.getUint8(reader.index + i, true);
    }

    reader.index += data.byteLength;

    return data;
}

function readUint16Array(reader, count) {
    const data = new Uint16Array(count);

    for (let i = 0; i < count; i++) {
        data[i] = reader.dataview.getUint16(reader.index + 2 * i, true);
    }

    reader.index += data.byteLength;

    return data;
}

function readUint32Array(reader, count) {
    const data = new Uint32Array(count);

    for (let i = 0; i < count; i++) {
        data[i] = reader.dataview.getUint32(reader.index + 4 * i, true);
    }

    reader.index += data.byteLength;

    return data;
}

function readFloat32Array(reader, count) {
    const data = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        data[i] = reader.dataview.getFloat32(reader.index + 4 * i, true);
    }

    reader.index += data.byteLength;

    return data;
}

function readFloat64Array(reader, count) {
    const data = new Float64Array(count);

    for (let i = 0; i < count; i++) {
        data[i] = reader.dataview.getFloat64(reader.index + 8 * i, true);
    }

    reader.index += data.byteLength;

    return data;
}

function readInt8Matrix(reader, rows, columns) {
    const data = [];

    for (let i = 0; i < rows; i++) {
        data[i] = readInt8Array(reader, columns);
    }

    return data;
}

function readInt16Matrix(reader, rows, columns) {
    const data = [];

    for (let i = 0; i < rows; i++) {
        data[i] = readInt16Array(reader, columns);
    }

    return data;
}

function readInt32Matrix(reader, rows, columns) {
    const data = [];

    for (let i = 0; i < rows; i++) {
        data[i] = readInt32Array(reader, columns);
    }

    return data;
}

function readUint8Matrix(reader, rows, columns) {
    const data = [];

    for (let i = 0; i < rows; i++) {
        data[i] = readUint8Array(reader, columns);
    }

    return data;
}

function readUint16Matrix(reader, rows, columns) {
    const data = [];

    for (let i = 0; i < rows; i++) {
        data[i] = readUint16Array(reader, columns);
    }

    return data;
}

function readUint32Matrix(reader, rows, columns) {
    const data = [];

    for (let i = 0; i < rows; i++) {
        data[i] = readUint32Array(reader, columns);
    }

    return data;
}

function readFloat32Matrix(reader, rows, columns) {
    const data = [];

    for (let i = 0; i < rows; i++) {
        data[i] = readFloat32Array(reader, columns);
    }

    return data;
}

function readFloat64Matrix(reader, rows, columns) {
    const data = [];

    for (let i = 0; i < rows; i++) {
        data[i] = readFloat64Array(reader, columns);
    }

    return data;
}

// Useful shortcuts?

function readVector2(reader) {
    return readFloat32Array(reader, 2);
}

function readVector3(reader) {
    return readFloat32Array(reader, 3);
}

function readVector4(reader) {
    return readFloat32Array(reader, 4);
}

function readMatrix(reader) {
    return readFloat32Array(reader, 16);
}

function readVector2Array(reader, size) {
    return readFloat32Matrix(reader, size, 2);
}

function readVector3Array(reader, size) {
    return readFloat32Matrix(reader, size, 3);
}

function readVector4Array(reader, size) {
    return readFloat32Matrix(reader, size, 4);
}

function readMatrixArray(reader, size) {
    return readFloat32Matrix(reader, size, 16);
}

function readPixel(reader) {
    return readUint8Array(4);
}

function readPixelArray(reader, size) {
    return readUint8Matrix(reader, size, 4);
}
