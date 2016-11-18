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
    this.uint8array = new Uint8Array(buffer, byteOffset, byteLength);
    this.index = 0;
    this.byteLength = buffer.byteLength;
    this.bitBuffer = 0;
    this.bits = 0;
}

function loadBits(buffer, bits) {
    while (buffer.bits < bits) {
        buffer.bitBuffer += buffer.uint8array[buffer.index] << buffer.bits;
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
