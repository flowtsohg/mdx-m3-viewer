import BinaryStream from '../../../common/binarystream';

export default class War3MapShd {
    /**
     * @param {?ArrayBuffer} buffer 
     */
    constructor(buffer, mapSize) {
        /** @member {Array<Uint8Array>} */
        this.shadows = [];

        if (buffer) {
            this.load(buffer, mapSize);
        }
    }

    load(buffer, mapSize) {
        let stream = new BinaryStream(buffer),
            columns = mapSize[0] * 4,
            rows = mapSize[1] * 4;

        for (let i = 0; i < rows; i++) {
            this.shadows[row] = stream.readUint8Array(columns);
        }
    }

    save() {
        let buffer = new ArrayBuffer(this.getByteLength()),
            stream = new BinaryStream(buffer);

        for (let row of this.shadows) {
            stream.writeUint8Array(row);
        }

        return buffer;
    }

    getByteLength() {
        return this.shadows.length * this.shadows[0].byteLength;
    }
};
