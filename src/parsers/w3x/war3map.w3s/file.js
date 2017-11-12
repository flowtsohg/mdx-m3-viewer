import BinaryStream from '../../../common/binarystream';
import Sound from './sound';

/**
 * @constructor
 * @param {?ArrayBuffer} buffer 
 */
function War3MapW3s(buffer) {
    this.version = 0;
    this.sounds = [];
    
    if (buffer) {
        this.load(buffer);
    }
}

War3MapW3s.prototype = {
    load(buffer) {
        let stream = new BinaryStream(buffer);

        this.version = stream.readInt32();

        for (let i = 0, l = stream.readUint32(); i < l; i++) {
            this.sounds[i] = new Sound(stream);
        }
    },

    save() {
        let buffer = new ArrayBuffer(this.calcSize()),
            stream = new BinaryStream(buffer);

        stream.writeInt32(this.version);
        stream.writeUint32(this.sounds.length);

        for (let sound of this.sounds) {
            sound.save(stream);
        }

        return buffer;
    },

    calcSize() {
        let size = 8;

        for (let sound of this.sounds) {
            size += sound.calcSize();
        }

        return size;
    }
};

export default War3MapW3s;
