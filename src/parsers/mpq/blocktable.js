import MpqBlock from './block';
import { BLOCK_TABLE_KEY, FILE_COMPRESSED, FILE_SINGLE_UNIT, FILE_EXISTS } from './constants';

export default class MpqBlockTable {
    /**
     * @param {MpqCrypto} c
     */
    constructor(c) {
        /** @param {MpqCrypto} */
        this.c = c;
        /** @param {Array<MpqBlock>} */
        this.entries = [];
    }

    add(buffer) {
        let block = new MpqBlock();
        
        block.normalSize = buffer.byteLength;

        this.entries.push(block);

        return block;
    }

    clear() {
        this.entries.length = 0;
    }

    addEmpties(howMany) {
        for (let i = 0; i < howMany; i++) {
            this.entries.push(new MpqBlock());
        }
    }

    load(typedArray) {
        let entriesCount = typedArray.byteLength / 16,
            uint32array = new Uint32Array(this.c.decryptBlock(typedArray, BLOCK_TABLE_KEY).buffer),
            offset = 0;

        // Clear the table and add the needed empties.
        this.clear();
        this.addEmpties(entriesCount);

        for (let block of this.entries) {
            block.load(uint32array.subarray(offset, offset + 4));

            offset += 4;
        }
    }

    /**
     * @param {Uint8Array} typedArray 
     */
    save(typedArray) {
        let uint32array = new Uint32Array(this.entries.length * 4),
            offset = 0;

        for (let block of this.entries) {
            block.save(uint32array.subarray(offset, offset + 4));

            offset += 4;
        }

        let uint8array = new Uint8Array(uint32array.buffer);

        this.c.encryptBlock(uint8array, BLOCK_TABLE_KEY);

        typedArray.set(uint8array);
    }
};
