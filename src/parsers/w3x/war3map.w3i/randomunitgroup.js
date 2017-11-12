import RandomUnit from './randomunit';

function RandomUnitGroup(stream) {
    this.id = 0;
    this.name = '';
    this.columnTypes = [];
    this.units = [];

    if (stream) {
        this.load(stream);
    }
}

RandomUnitGroup.prototype = {
    load(stream) {
        this.id = stream.readInt32();
        this.name = stream.readUntilNull();
        this.positions = stream.readInt32();
        this.columnTypes = stream.readInt32Array(this.positions);

        for (let i = 0, l = stream.readUint32(); i < l; i++) {
            this.units[i] = new RandomUnit(stream, this.positions);
        }
    },

    save(stream) {
        stream.writeInt32(this.id);
        stream.write(`${this.name}\0`);
        stream.writeInt32(this.positions);
        stream.writeInt32Array(this.columnTypes);
        stream.writeUint32(this.units.length);

        for (let unit of this.units) {
            unit.save(stream);
        }
    },

    calcSize() {
        return 13 + this.name.length + this.columnTypes.byteLength + (this.units.length * (4 + 4 * this.positions));
    }
};

export default RandomUnitGroup;
