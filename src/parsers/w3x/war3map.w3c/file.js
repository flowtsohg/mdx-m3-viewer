import BinaryStream from '../../../common/binarystream';
import Camera from './camera';

/**
 * @constructor
 * @param {?ArrayBuffer} buffer 
 */
function War3MapW3c(buffer) {
    this.version = 0;
    this.cameras = [];

    if (buffer) {
        this.load(buffer);
    }
}

War3MapW3c.prototype = {
    /**
     * @param {?ArrayBuffer} buffer 
     */
    load(buffer) {
        let stream = new BinaryStream(buffer);

        this.version = stream.readInt32();

        for (let i = 0, l = stream.readUint32(); i < l; i++) {
            this.cameras[i] = new Camera(stream);
        }
    },

    /**
     * 
     */
    save() {
        let buffer = new ArrayBuffer(this.calcSize()),
            stream = new BinaryStream(buffer);

        stream.writeInt32(this.version);
        stream.writeUint32(this.cameras.length);

        for (let camera of this.cameras) {
            camera.save(stream);
        }

        return buffer;
    },

    /**
     * @returns {number}
     */
    calcSize() {
        let size = 8;

        for (let camera of this.cameras) {
            size += camera.calcSize();
        }

        return size;
    }
};

export default War3MapW3c;
