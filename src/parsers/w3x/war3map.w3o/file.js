import BinaryStream from '../../../common/binarystream';
import War3MapW3u from '../war3map.w3u/file';
import War3MapW3d from '../war3map.w3d/file';

/**
 * @constructor
 * @param {?ArrayBuffer} buffer 
 */
function War3MapW3o(buffer) {
    this.version = 0;
    this.units = null;
    this.items = null;
    this.destructables = null;
    this.doodads = null;
    this.abilities = null;
    this.buffs = null;
    this.upgrades = null;

    if (buffer) {
        this.load(buffer);
    }
}

War3MapW3o.prototype = {
    load(buffer) {
        let stream = new BinaryStream(buffer);

        this.version = stream.readInt32();

        if (stream.readInt32()) {
            this.units = new War3MapW3u(stream);
        }

        if (stream.readInt32()) {
            this.items = new War3MapW3u(stream);
        }

        if (stream.readInt32()) {
            this.destructables = new War3MapW3u(stream);
        }

        if (stream.readInt32()) {
            this.doodads = new War3MapW3d(stream);
        }

        if (stream.readInt32()) {
            this.abilities = new War3MapW3d(stream);
        }

        if (stream.readInt32()) {
            this.buffs = new War3MapW3u(stream);
        }

        if (stream.readInt32()) {
            this.upgrades = new War3MapW3d(stream);
        }
    },

    save() {
        let buffer = new ArrayBuffer(this.calcSize()),
            stream = new BinaryStream(buffer);

        stream.writeInt32(this.version);

        if (this.units) {
            stream.writeInt32(1);
            this.units.save(stream);
        } else {
            stream.writeInt32(0);
        }

        if (this.items) {
            stream.writeInt32(1);
            this.items.save(stream);
        } else {
            stream.writeInt32(0);
        }

        if (this.destructables) {
            stream.writeInt32(1);
            this.destructables.save(stream);
        } else {
            stream.writeInt32(0);
        }

        if (this.doodads) {
            stream.writeInt32(1);
            this.doodads.save(stream);
        } else {
            stream.writeInt32(0);
        }

        if (this.abilities) {
            stream.writeInt32(1);
            this.abilities.save(stream);
        } else {
            stream.writeInt32(0);
        }

        if (this.buffs) {
            stream.writeInt32(1);
            this.buffs.save(stream);
        } else {
            stream.writeInt32(0);
        }

        if (this.upgrades) {
            stream.writeInt32(1);
            this.upgrades.save(stream);
        } else {
            stream.writeInt32(0);
        }

        return buffer;
    },

    calcSize() {
        let size = 32;

        if (this.units) {
            size += this.units.calcSize();
        }

        if (this.items) {
            size += this.items.calcSize();
        }
        
        if (this.destructables) {
            size += this.destructables.calcSize();
        }

        if (this.doodads) {
            size += this.doodads.calcSize();
        }

        if (this.abilities) {
            size += this.abilities.calcSize();
        }

        if (this.buffs) {
            size += this.buffs.calcSize();
        }

        if (this.upgrades) {
            size += this.upgrades.calcSize();
        }

        return size;
    }
};

export default War3MapW3o;
