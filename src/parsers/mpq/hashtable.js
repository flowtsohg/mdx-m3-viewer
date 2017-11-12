import { powerOfTwo } from '../../common/math';
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

    load(typedArray) {
        let entriesCount = typedArray.byteLength / 16,
            uint32array = new Uint32Array(this.c.decryptBlock(typedArray, HASH_TABLE_KEY).buffer),
            offset = 0;

        // Clear the table and add the needed empties.
        this.clear();
        this.addEmpties(entriesCount);

        for (let hash of this.entries) {
            hash.load(uint32array.subarray(offset, offset + 4));

            offset += 4;
        }
    },

    /**
     * @param {Uint8Array} typedArray 
     */
    save(typedArray) {
        let uint32array = new Uint32Array(this.entries.length * 4),
            offset = 0;

        for (let hash of this.entries) {
            hash.save(uint32array.subarray(offset, offset + 4));

            offset += 4;
        }

        let uint8array = new Uint8Array(uint32array.buffer);

        this.c.encryptBlock(uint8array, HASH_TABLE_KEY);

        typedArray.set(uint8array);
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
            } else if (hash.blockIndex === 0xFFFFFFFF) {
                return null;
            }
        }

        return null;
    }
};

export default MpqHashTable;
