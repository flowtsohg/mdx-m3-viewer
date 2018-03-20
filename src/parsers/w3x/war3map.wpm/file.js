import BinaryStream from '../../../common/binarystream';

export default class War3MapWpm {
    /**
     * @param {?ArrayBuffer} buffer 
     */
    constructor(buffer) {
        /** @member {number} */
        this.version = 0;
        /** @member {number} */
        this.size = new Int32Array(2);
        /** @member {Uint8Array} */
        this.pathing = new Uint8Array(1);

        if (buffer) {
            this.load(buffer);
        }
    }

    /**
     * @param {ArrayBuffer} buffer 
     */
    load(buffer) {
        let stream = new BinaryStream(buffer);

        if (stream.read(4) !== 'MP3W') {
            return false;
        }

        this.version = stream.readInt32();
        this.size = stream.readInt32Array(2);
        this.pathing = stream.readUint8Array(this.size[0] * this.size[1]);
    }

    /**
     * @returns {ArrayBuffer} 
     */
    save() {
        let buffer = new ArrayBuffer(this.getByteLength()),
            stream = new BinaryStream(buffer);

        stream.write('MP3W');
        stream.writeInt32(this.version);
        stream.writeInt32Array(this.size);
        stream.writeUint8Array(this.pathing);

        return buffer;
    }

    /**
     * @returns {number} 
     */
    getByteLength() {
        return 16 + (this.size[0] * this.size[1]);
    }
};
