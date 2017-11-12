import RandomUnitGroup from './randomunitgroup';

function RandomUnitTable(stream) {
    this.groups = [];

    if (stream) {
        this.load(stream);
    }
}

RandomUnitTable.prototype = {
    load(stream) {
        for (let i = 0, l = stream.readUint32(); i < l; i++) {
            this.groups[i] = new RandomUnitGroup(stream);
        }
    },

    save(stream) {
        stream.writeUint32(this.groups.length);

        for (let group of this.groups) {
            group.save(stream);
        }
    },

    calcSize() {
        let size = 4;

        for (let group of this.groups) {
            size += group.calcSize();
        }

        return size;
    }
};

export default RandomUnitTable;
