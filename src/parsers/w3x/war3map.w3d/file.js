import BinaryStream from '../../../common/binarystream';
import ModificationTable from '../war3map.w3u/modificationtable';

export default class War3MapW3d {
    constructor() {
        /** @member {number} */
        this.version = 0;
        /** @member {ModificationTable} */
        this.originalTable = new ModificationTable();
        /** @member {ModificationTable} */
        this.customTable = new ModificationTable();
    }

    /**
     * @param {ArrayBuffer} buffer 
     */
    load(buffer) {
        let stream = new BinaryStream(buffer);

        this.version = stream.readInt32();
        this.originalTable.load(stream, true);
        this.customTable.load(stream, true);
    }

    /**
     * @returns {ArrayBuffer}  
     */
    save() {
        let buffer = new ArrayBuffer(this.getByteLength()),
            stream = new BinaryStream(buffer);

        stream.writeInt32(this.version);
        this.originalTable.save(stream, true);
        this.customTable.save(stream, true);

        return buffer;
    }

    /**
     * @returns {number}  
     */
    getByteLength() {
        return 4 + this.originalTable.getByteLength(true) + this.customTable.getByteLength(true);
    }
};
