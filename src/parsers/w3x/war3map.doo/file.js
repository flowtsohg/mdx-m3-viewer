import BinaryStream from '../../../common/binarystream';
import Doodad from './doodad';
import SpecialDoodad from './specialdoodad';

/**
 * @constructor
 * @param {?ArrayBuffer} buffer
 */
function War3MapDoo(buffer) {
    this.version = 0;
    this.u1 = new Uint8Array(4);
    this.doodads = [];
    this.u2 = new Uint8Array(4);
    this.specialDoodads = [];

    if (buffer) {
        this.load(buffer);
    }
}

War3MapDoo.prototype = {
    load(buffer) {
        let stream = new BinaryStream(buffer);

        if (stream.read(4) !== 'W3do') {
            return false;
        }

        this.version = stream.readInt32();
        this.u1 = stream.readUint8Array(4);
    
        for (let i = 0, l = stream.readInt32(); i < l; i++) {
            this.doodads[i] = new Doodad(stream, this.version)
        }
    
        this.u2 = stream.readUint8Array(4);
    
        for (let i = 0, l = stream.readInt32(); i < l; i++) {
            this.specialDoodads[i] = new SpecialDoodad(stream, this.version)
        }
    },

    save() {
        let buffer = new ArrayBuffer(this.calcSize()),
            stream = new BinaryStream(buffer);

        stream.write('W3do');
        stream.writeInt32(this.version);
        stream.writeUint8Array(this.u1);
        stream.writeUint32(this.doodads.length);

        for (let doodad of this.doodads) {
            doodad.save(stream);
        }

        stream.writeUint8Array(this.u2);
        stream.writeUint32(this.specialDoodads.length);

        for (let doodad of this.specialDoodads) {
            doodad.save(stream);
        }

        return buffer;
    },

    calcSize() {
        return 24 + (this.doodads.length * (this.version > 7 ? 50 : 42)) + (this.specialDoodads.length * 16);
    }
};

export default War3MapDoo;
