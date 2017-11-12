import BinaryStream from '../../../common/binarystream';
import Import from './import';

/**
 * @constructor
 *  @param {?ArrayBuffer} buffer 
 */
function War3MapImp(buffer) {
    this.version = 1;
    this.entries = new Map();

    if (buffer) {
        this.load(buffer);
    }
}

War3MapImp.prototype = {
    /**
     * @param {ArrayBuffer} buffer 
     */
    load(buffer) {
        let stream = new BinaryStream(buffer);

        this.version = stream.readUint32();
        
        for (let i = 0, l = stream.readUint32(); i < l; i++) {
            let entry = new Import(stream);

            this.entries.set(entry.path, entry);
        }
    },

    /**
     * @returns {ArrayBuffer}
     */
    save() {
        let buffer = new ArrayBuffer(this.calcSize()),
            stream = new BinaryStream(buffer);

            stream.writeUint32(this.version);
            stream.writeUint32(this.entries.size);

        for (let entry of this.entries.values()) {
            entry.save(stream);
        }

        return buffer;
    },

    /**
     * @returns {number}
     */
    calcSize() {
        let size = 8;

        for (let entry of this.entries.values()) {
            size += entry.calcSize();
        }

        return size;
    },
    
    set(name) {
        if (!this.entries.has(name)) {
            let entry = new Import();

            entry.isCustom = 10;
            entry.path = name;

            this.entries.set(name, entry);

            return true;
        }

        return false;
    },

    has(name) {
        return this.entries.has(name);
    },

    delete(name) {
        return this.entries.delete(name);
    },

    rename(name, newName) {
        let entry = this.entries.get(name);

        if (entry) {
            entry.isCustom = 10;
            entry.path = newName;

            return true;
        }

        return false;
    }
};

export default War3MapImp;
