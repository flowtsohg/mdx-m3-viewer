import BinaryStream from '../../../common/binarystream';

/**
 * @constructor
 * @param {?ArrayBuffer} buffer 
 */
function War3MapWpm(buffer) {
    this.version = 0;
    this.size = new Int32Array(2);
    this.pathing = [];

    if (buffer) {
        this.load(buffer);
    }
}

War3MapWpm.prototype = {
    load(buffer) {
        let stream = new BinaryStream(buffer);

        if (stream.read(4) !== 'MP3W') {
            return false;
        }

        this.version = stream.readInt32();
        this.size = stream.readInt32Array(2);

        for (let row = 0, rows = this.size[1]; row < rows; row++) {
            this.pathing[row] = [];

            for (let column = 0, columns = this.size[0]; column < columns; column++) {
                this.pathing[row][column] = stream.readUint8()
            }
        }
    },

    save() {
        let buffer = new ArrayBuffer(this.calcSize()),
            stream = new BinaryStream(buffer);

        stream.write('MP3W');
        stream.writeInt32(this.version);
        stream.writeInt32Array(this.size);

        for (let row of this.pathing) {
            for (let value of row) {
                stream.writeUint8(value);
            }
        }

        return buffer;
    },

    calcSize() {
        return 16 + (this.size[0] * this.size[1]);
    }
};

export default War3MapWpm;
