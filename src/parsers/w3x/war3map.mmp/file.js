import BinaryStream from '../../../common/binarystream';
import MinimapIcon from './minimapicon';

/**
 * @constructor
 * @param {?ArrayBuffer} buffer 
 */
function War3MapMmp(buffer) {
    this.u1 = 0;
    this.icons = [];

    if (buffer) {
        this.load(buffer);
    }
}

War3MapMmp.prototype = {
    load(buffer) {
        let stream = new BinaryStream(buffer);

        this.u1 = stream.readInt32();

        for (let i = 0, l = stream.readInt32(); i < l; i++) {
            this.icons[i] = new MinimapIcon(stream);
        }
    },

    save() {
        let buffer = new ArrayBuffer(this.calcSize()),
            stream = new BinaryStream(buffer);

        stream.writeInt32(this.u1);
        stream.writeUint32(this.icons.length);

        for (let icon of this.icons) {
            icon.save(stream);
        }

        return buffer;
    },

    calcSize() {
        return 8 + this.icons.length * 16;
    }
};

export default War3MapMmp;
