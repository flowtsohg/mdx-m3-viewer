export default class UnknownChunk {
    constructor(stream, size, tag) {
        /** @member {Uint8Array} */
        this.chunk = stream.readUint8Array(new Uint8Array(size));
        /** @member {string} */
        this.tag = tag;
    }

    getByteLength() {
        return this.chunk.byteLength;
    }
};
