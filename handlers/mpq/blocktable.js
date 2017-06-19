/**
 * @constructor
 * @param {BinaryReader} reader
 */
function MpqBlockTableEntry(reader) {
    /** @param {number} */
    this.filePos = reader.readUint32();
    /** @param {number} */
    this.compressedSize = reader.readUint32();
    /** @param {number} */
    this.normalSize = reader.readUint32();
    /** @param {number} */
    this.flags = reader.readUint32();
}

/**
 * @constructor
 * @param {ArrayBuffer} buffer
 * @param {MpqCrypto} c
 */
function MpqBlockTable(buffer, c) {
    let entries = [],
        reader = new BinaryReader(c.decryptBlock(buffer, Mpq.BLOCK_TABLE_KEY)),
        hashSize = buffer.byteLength / 16;

    for (let i = 0, l = hashSize; i < l; i++) {
        entries.push(new MpqBlockTableEntry(reader));
    }

    /** @param {number} */
    this.hashSize = hashSize;
    /** @param {MpqCrypto} */
    this.c = c;
    /** @param {Array<MpqBlockTableEntry>} */
    this.entries = entries;
}

