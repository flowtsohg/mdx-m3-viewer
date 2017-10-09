import BinaryReader from '../../../binaryreader';
import BinaryWriter from '../../../binarywriter';
import MpqBlock from './block';
import { BLOCK_TABLE_KEY, FILE_COMPRESSED, FILE_SINGLE_UNIT, FILE_EXISTS } from './constants';

/**
 * @constructor
 * @param {MpqCrypto} c
 */
function MpqBlockTable(c) {
    /** @param {MpqCrypto} */
    this.c = c;
    /** @param {Array<MpqBlock>} */
    this.entries = [];
}

MpqBlockTable.prototype = {
    add(buffer) {
        let block = new MpqBlock();
        
        block.normalSize = buffer.byteLength;

        this.entries.push(block);

        return block;
    },

    clear() {
        this.entries.length = 0;
    },

    load(buffer) {
        // Clear all of the entries.
        this.clear();
        
        let reader = new BinaryReader(this.c.decryptBlock(buffer, BLOCK_TABLE_KEY));

        for (let i = 0, l = buffer.byteLength / 16; i < l; i++) {
            let block = new MpqBlock();

            block.load(reader);

            this.entries.push(block);
        }
    },

    save(writer) {
        let entries = this.entries,
            buffer = new ArrayBuffer(entries.length * 16),
            localwriter = new BinaryWriter(buffer);

        for (let block of entries) {
            block.save(localwriter);
        }

        writer.writeUint8Array(new Uint8Array(this.c.encryptBlock(buffer, BLOCK_TABLE_KEY)));
    }
};

export default MpqBlockTable;
