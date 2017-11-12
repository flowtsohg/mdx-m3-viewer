import BinaryStream from '../../../common/binarystream';
import CustomTextTrigger from './customtexttrigger';

/**
 * @constructor
 * @param {?ArrayBuffer} buffer 
 */
function War3MapWct(buffer) {
    this.version = 0;
    this.comment = '';
    this.trigger = null;
    this.triggers = [];

    if (buffer) {
        this.load(buffer);
    }
}

War3MapWct.prototype = {
    load(buffer) {
        let stream = new BinaryStream(buffer);

        this.version = stream.readInt32();

        if (this.version === 1) {
            this.comment = stream.readUntilNull();
            this.trigger = new CustomTextTrigger(stream);
        }

        for (let i = 0, l = stream.readUint32(); i < l; i++) {
            this.triggers[i] = new CustomTextTrigger(stream);
        }
    },

    save() {
        let buffer = new ArrayBuffer(this.calcSize()),
            stream = new BinaryStream(buffer);

        stream.writeInt32(this.version);

        if (this.version === 1) {
            stream.write(`${this.comment}\0`);
            this.trigger.save(stream);
        }

        stream.writeUint32(this.triggers.length);

        for (let trigger of this.triggers) {
            trigger.save(stream);
        }

        return buffer;
    },

    calcSize() {
        let size = 8;

        if (this.version === 1) {
            size += this.comment.length + 1 + this.trigger.calcSize();
        }

        for (let trigger of this.triggers) {
            size += trigger.calcSize();
        }

        return size;
    }
};

export default War3MapWct;
