const MPQ_KEY_BLOCK_TABLE = 0xEC83B3A3;

function MpqBlockTableEntry(reader) {
    this.filePos = readUint32(reader);
    this.compressedSize = readUint32(reader);
    this.normalSize = readUint32(reader);
    this.flags = readUint32(reader);
}

function MpqBlockTable(buffer, c) {
    this.hashSize = buffer.byteLength / 16;
    this.c = c;
    this.prepareEntries(c.decryptBlock(buffer, MPQ_KEY_BLOCK_TABLE));
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
