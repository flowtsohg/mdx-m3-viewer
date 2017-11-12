import RandomItemGroup from './randomitemgroup';

function RandomItemTable(stream) {
    this.groups = [];

    if (stream) {
        this.load(stream);
    }
}

RandomItemTable.prototype = {
    load(stream) {
        for (let i = 0, l = stream.readUint32(); i < l; i++) {
            this.groups[i] = new RandomItemGroup(stream);
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

export default RandomItemTable;
