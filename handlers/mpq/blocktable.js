/**
 * @constructor
 * @param {BinaryReader} reader
 */
function MpqBlockTableEntry(reader) {
    this.filePos = reader.readUint32();
    this.compressedSize = reader.readUint32();
    this.normalSize = reader.readUint32();
    this.flags = reader.readUint32();
}

/**
 * @constructor
 * @param {ArrayBuffer} buffer
 * @param {MpqCrypto} c
 */
function MpqBlockTable(buffer, c) {
    this.hashSize = buffer.byteLength / 16;
    this.c = c;
    this.prepareEntries(c.decryptBlock(buffer, Mpq.BLOCK_TABLE_KEY));
}

MpqBlockTable.prototype = {
    prepareEntries(buffer) {
        let entries = [],
            reader = new BinaryReader(buffer);

        for (let i = 0, l = this.hashSize; i < l; i++) {
            entries.push(new MpqBlockTableEntry(reader));
        }

        this.entries = entries;
    }
};
