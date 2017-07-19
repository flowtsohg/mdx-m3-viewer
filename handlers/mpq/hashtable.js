import BinaryReader from "../../src/binaryreader";

let HASH_TABLE_KEY = 0xC3AF3770,
    HASH_TABLE_INDEX = 0,
    HASH_NAME_A = 1,
    HASH_NAME_B = 2;

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function MpqHashTableEntry(reader) {
    this.name1 = reader.readUint32();
    this.name2 = reader.readUint32();
    this.locale = reader.readUint16();
    this.platform = reader.readUint16();
    this.blockIndex = reader.readUint32();
}

/**
 * @constructor
 * @param {ArrayBuffer} buffer
 * @param {MpqCrypto} c
 */
function MpqHashTable(buffer, c) {
    this.hashSize = buffer.byteLength / 16;
    this.c = c;
    this.prepareEntries(c.decryptBlock(buffer, HASH_TABLE_KEY));
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
            name1 = c.hash(name, HASH_NAME_A),
            name2 = c.hash(name, HASH_NAME_B),
            offset = c.hash(name, HASH_TABLE_INDEX) & (this.hashSize - 1),
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

export default MpqHashTable;
