import { powerOfTwo } from '../../../common/math';
import BinaryReader from '../../../binaryreader';
import BinaryWriter from '../../../binarywriter';
import MpqHash from './hash';
import { HASH_TABLE_KEY, HASH_TABLE_INDEX, HASH_NAME_A, HASH_NAME_B } from './constants';

/**
 * @constructor
 * @param {MpqCrypto} c
 */
function MpqHashTable(c) {
    /** @param {MpqCrypto} */
    this.c = c;
    /** @param {Array<MpqHash>} */
    this.entries = [];

    // Minimum size
    this.addEmpties(4);
}

MpqHashTable.prototype = {
    clear() {
        this.entries.length = 0;
    },

    addEmpties(howMany) {
        for (let i = 0; i < howMany; i++) {
            this.entries.push(new MpqHash());
        }
    },

    getInsertionIndex(name) {
        let entries = this.entries,
            offset = this.c.hash(name, HASH_TABLE_INDEX) & (entries.length - 1);

        for (let i = 0, l = entries.length; i < l; i++) {
            let index = (i + offset) % l,
                hash = entries[index];
            
            if (hash.platform === 0xFFFF) {
                return index;
            }
        }

        return -1;
    },

    add(name, blockIndex) {
        let insertionIndex = this.getInsertionIndex(name);

        if (insertionIndex !== -1) {
            let hash = this.entries[insertionIndex];

            hash.nameA = this.c.hash(name, HASH_NAME_A);
            hash.nameB = this.c.hash(name, HASH_NAME_B);
            hash.locale = 0;
            hash.platform = 0;
            hash.blockIndex = blockIndex;
            
            return hash;
        }
    },

    load(buffer) {
        let reader = new BinaryReader(this.c.decryptBlock(buffer, HASH_TABLE_KEY)),
            entriesCount = buffer.byteLength / 16;

        // Clear the table and add the needed empties.
        this.clear();
        this.addEmpties(entriesCount);

        for (let hash of this.entries) {
            hash.load(reader);
        }
    },

    save(writer) {
        let entries = this.entries,
            buffer = new ArrayBuffer(entries.length * 16),
            localwriter = new BinaryWriter(buffer);

        for (let hash of entries) {
            hash.save(localwriter);
        }

        writer.writeUint8Array(new Uint8Array(this.c.encryptBlock(buffer, HASH_TABLE_KEY)));
    },

    get(name) {
        let c = this.c,
            entries = this.entries,
            offset = c.hash(name, HASH_TABLE_INDEX) & (entries.length - 1),
            nameA = c.hash(name, HASH_NAME_A),
            nameB = c.hash(name, HASH_NAME_B);

        for (let i = 0, l = entries.length; i < l; i++) {
            let hash = entries[(i + offset) % l];

            if (nameA === hash.nameA && nameB === hash.nameB) {
                return hash;
            } else if (hash.platform === 0xFFFF) {
                return null;
            }
        }

        return null;
    }
};

export default MpqHashTable;
