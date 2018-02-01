import BinaryStream from '../../../common/binarystream';
import Unit from './unit';

/**
 * @constructor
 * @param {?ArrayBuffer} buffer
 */
function War3MapUnitsDoo(buffer) {
    this.version = 8;
    this.unknown = 11;
    this.units = [];

    if (buffer) {
        this.load(buffer);
    }
}

War3MapUnitsDoo.prototype = {
    load(buffer) {
        let stream = new BinaryStream(buffer);

        if (stream.read(4) !== 'W3do') {
            return false;
        }

        this.version = stream.readInt32();
        this.unknown = stream.readUint32();

        for (let i = 0, l = stream.readInt32(); i < l; i++) {
            this.units[i] = new Unit(stream, this.version);
        }
    },

    save() {
        let buffer = new ArrayBuffer(this.calcSize()),
            stream = new BinaryStream(buffer);

        stream.write('W3do');
        stream.writeInt32(this.version);
        stream.writeUint32(this.unknown);
        stream.writeInt32(this.units.length);

        for (let unit of this.units) {
            unit.save(stream, this.version);
        }

        return buffer;
    },

    calcSize() {
        let size = 16;
        
        for (let unit of this.units) {
            size += unit.calcSize(this.version);
        }
        
        return size;
    },

    createUnit() {
        let unit = new Unit();

        this.units.push(unit);

        return unit;
    },

    addUnit(unit) {
        this.units.push(unit);
    }
};

export default War3MapUnitsDoo;
