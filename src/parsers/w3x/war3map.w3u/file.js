import BinaryStream from '../../../common/binarystream';
import ModificationTable from './modificationtable';

export default class War3MapW3u {
    /**
     * @param {?ArrayBuffer} buffer 
     */
    constructor(buffer) {
        /** @member {number} */
        this.version = 0;
        /** @member {ModificationTable} */
        this.originalTable = new ModificationTable();
        /** @member {ModificationTable} */
        this.customTable = new ModificationTable();

        if (buffer) {
            this.load(buffer);
        }
    }

    /**
     * @param {ArrayBuffer} buffer 
     */
    load(buffer) {
        let stream = new BinaryStream(buffer);

        this.version = stream.readInt32();
        this.originalTable.load(stream, false);
        this.customTable.load(stream, false);
    }

    /**
     * @returns {ArrayBuffer} 
     */
    save() {
        let buffer = new ArrayBuffer(this.getByteLength()),
            stream = new BinaryStream(buffer);

        stream.writeInt32(this.version);
        this.originalTable.save(stream, false);
        this.customTable.save(stream, false);

        return buffer;
    }

    /**
     * @returns {number} 
     */
    getByteLength() {
        return 4 + this.originalTable.getByteLength(false) + this.customTable.getByteLength(false);
    }
};
