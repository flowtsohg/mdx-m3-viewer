import BinaryStream from '../../../common/binarystream';

/**
 * @constructor
 * @param {?ArrayBuffer} buffer 
 */
function War3MapShd(buffer, mapSize) {
    this.shadows = [];

    if (buffer) {
        this.load(buffer, mapSize);
    }
}

War3MapShd.prototype = {
    load(buffer, mapSize) {
        let stream = new BinaryStream(buffer);

        for (let row = 0, rows = mapSize[1] * 4; row < rows; row++) {
            this.shadows[row] = [];

            for (let column = 0, columns = mapSize[0] * 4; column < columns; column++) {
                this.shadows[row][column] = stream.readUint8()
            }
        }
    },

    save() {
        let buffer = new ArrayBuffer(this.calcSize()),
            stream = new BinaryStream(buffer);

        for (let row of this.shadows) {
            for (let column of row) {
                stream.writeUint8(this.shadows[row][column]);
            }
        }

        return buffer;
    },

    calcSize() {
        return (this.shadows.length * this.shadows[0].length);
    }
};

export default War3MapShd;
