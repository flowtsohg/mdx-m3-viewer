import BinaryStream from '../../../common/binarystream';
import ModificationTable from './modificationtable';

/**
 * @constructor
 * @param {?ArrayBuffer} buffer 
 */
function War3MapW3u(buffer) {
    this.version = 0;
    this.originalTable = new ModificationTable();
    this.customTable = new ModificationTable();

    if (buffer) {
        this.load(buffer);
    }
}

War3MapW3u.prototype = {
    load(buffer) {
        let stream = new BinaryStream(buffer);

        this.version = stream.readInt32();
        this.originalTable.load(stream, false);
        this.customTable.load(stream, false);
    },

    save() {
        let buffer = new ArrayBuffer(this.calcSize()),
            stream = new BinaryStream(buffer);

        stream.writeInt32(this.version);
        this.originalTable.save(stream, false);
        this.customTable.save(stream, false);

        return buffer;
    },

    calcSize() {
        return 4 + this.originalTable.calcSize(false) + this.customTable.calcSize(false);
    }
};

export default War3MapW3u;
