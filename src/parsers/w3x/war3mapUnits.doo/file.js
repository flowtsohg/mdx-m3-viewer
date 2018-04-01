import BinaryStream from '../../../common/binarystream';
import Unit from './unit';

export default class War3MapUnitsDoo {
    /**
     * @param {?ArrayBuffer} buffer
     */
    constructor(buffer) {
        /** @member {number} */
        this.version = 8;
        /** @member {number} */
        this.unknown = 11;
        /** @member {Array<Unit>} */
        this.units = [];

        if (buffer) {
            this.load(buffer);
        }
    }

    /**
     * @param {ArrayBuffer} buffer
     */
    load(buffer) {
        let stream = new BinaryStream(buffer);

        if (stream.read(4) !== 'W3do') {
            return false;
        }

        this.version = stream.readInt32();
        this.unknown = stream.readUint32();

        for (let i = 0, l = stream.readInt32(); i < l; i++) {
            let unit = new Unit();

            unit.load(stream, this.version);

            this.units[i] = unit;
        }
    }

    /**
     * @returns {ArrayBuffer} 
     */
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
    }

    /**
     * @returns {number} 
     */
    getByteLength() {
        let size = 16;

        for (let unit of this.units) {
            size += unit.getByteLength(this.version);
        }

        return size;
    }

    createUnit() {
        let unit = new Unit();

        this.units.push(unit);

        return unit;
    }

    addUnit(unit) {
        this.units.push(unit);
    }
};
