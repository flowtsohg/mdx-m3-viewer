import BinaryStream from '../../../common/binarystream';
import ModificationTable from '../war3map.w3u/modificationtable';

/**
 * @constructor
 * @param {?ArrayBuffer} buffer 
 */
function War3MapW3d(buffer) {
    this.version = 0;
    this.originalTable = new ModificationTable();
    this.customTable = new ModificationTable();
}

War3MapW3d.prototype = {
    load(buffer) {
        let stream = new BinaryStream(buffer);

        this.version = stream.readInt32();
        this.originalTable.load(stream, true);
        this.customTable.load(stream, true);
    },

    save() {
        let buffer = new ArrayBuffer(this.calcSize()),
            stream = new BinaryStream(buffer);

        stream.writeInt32(this.version);
        this.originalTable.save(stream, true);
        this.customTable.save(stream, true);

        return buffer;
    },

    calcSize() {
        return 4 + this.originalTable.calcSize(true) + this.customTable.calcSize(true);
    }
};

export default War3MapW3d;
