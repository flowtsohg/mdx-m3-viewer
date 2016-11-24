function MpqHashTableEntry(reader) {
    this.name1 = readUint32(reader);
    this.name2 = readUint32(reader);
    this.locale = readUint16(reader);
    this.platform = readUint16(reader);
    this.blockIndex = readUint32(reader);
}

function MpqHashTable(buffer, c) {
    this.hashSize = buffer.byteLength / 16;
    this.c = c;
    this.prepareEntries(c.decryptBlock(buffer, Mpq.HASH_TABLE_KEY));
}

MpqHashTable.prototype = {
    prepareEntries(buffer) {
        let entries = [],
            reader = new BinaryReader(buffer);

        for (let i = 0, l = this.hashSize; i < l; i++) {
            entries.push(new MpqHashTableEntry(reader));
        }

        this.entries = entries;
    },

    getBlockIndexOfFile(name) {
        let c = this.c,
            name1 = c.hash(name, Mpq.HASH_NAME_A),
            name2 = c.hash(name, Mpq.HASH_NAME_B),
            offset = c.hash(name, Mpq.HASH_TABLE_INDEX) & (this.hashSize - 1),
            entries = this.entries,
            entry;

        for (let i = 0, l = entries.length; i < l; i++) {
            entry = entries[(i + offset) % l];

            if (name1 === entry.name1 && name2 === entry.name2) {
                return entry.blockIndex;
            } else if (entry.platform !== 0) {
                return -1;
            }
        }

        return -1;
    }
};
