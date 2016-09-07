function BitBuffer(buffer) {
    if (buffer instanceof ArrayBuffer) {
        this.uint8Array = new Uint8Array(buffer);
    } else {
        this.uint8Array = buffer;
    }

    this.index = 0;
    this.byteLength = buffer.byteLength;
    this.bitBuffer = 0;
    this.bits = 0;
}

function peekBits(buffer, bits) {
    if (buffer.bits < bits) {
        buffer.bitBuffer += buffer.uint8Array[buffer.index] << buffer.bits;
        buffer.bits |= 8;

        buffer.index += 1;
    }

    return (buffer.bitBuffer & (1 << bits));
}

function readBits(buffer, bits) {
    const data = peekBits(buffer, bits);

    buffer.bitBuffer >>>= bits;
    buffer.bits -= bits;

    return data;
}

// Note that readBits and writeBits should probably never be used on the same buffer
function writeBits(buffer, value, bits) {
    buffer.bitBuffer |= value << buffer.bits;
    buffer.bits += bits;

    while (buffer.bits >= 8) {
        buffer.uint8Array[buffer.index] = buffer.bitBuffer & 0xFF;

        buffer.index += 1;

        buffer.bitBuffer >>>= 8;
        buffer.bits -= 8;
    }
}

function skipBits(buffer, bits) {
    if (buffer.bits < bits) {
        buffer.bitBuffer |= buffer.uint8Array[buffer.index] << buffer.bits;
        buffer.bits += 8;

        buffer.index += 1;
    }

    buffer.bitBuffer >>>= bits;
    buffer.bits -= bits;
}
