function BitBuffer(buffer, byteOffset, byteLength) {
    if (!(buffer instanceof ArrayBuffer)) {
        throw new TypeError("BitBuffer: expected ArrayBuffer, got " + buffer);
    }

    this.buffer = buffer;
    this.uint8array = new Uint8Array(buffer, byteOffset, byteLength);
    this.index = 0;
    this.byteLength = buffer.byteLength;
    this.bitBuffer = 0;
    this.bits = 0;
}

function loadBits(buffer, bits) {
    while (buffer.bits < bits) {
        buffer.bitBuffer += buffer.uint8Array[buffer.index] << buffer.bits;
        buffer.bits += 8;
        buffer.index += 1;
    }
}

function peekBits(buffer, bits) {
    loadBits(buffer, bits);

    return (buffer.bitBuffer & (1 << bits));
}

function readBits(buffer, bits) {
    const data = peekBits(buffer, bits);

    buffer.bitBuffer >>>= bits;
    buffer.bits -= bits;

    return data;
}

function skipBits(buffer, bits) {
    loadBits(buffer, bits);

    buffer.bitBuffer >>>= bits;
    buffer.bits -= bits;
}
