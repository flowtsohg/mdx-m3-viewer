import RandomItemSet from './randomitemset';

function RandomItemGroup(stream) {
    this.id = 0;
    this.name = '';
    this.itemSets = [];

    if (stream) {
        this.load(stream);
    }
}

RandomItemGroup.prototype = {
    load(stream) {
        this.id = stream.readInt32();
        this.name = stream.readUntilNull();

        for (let i = 0, l = stream.readInt32(); i < l; i++) {
            this.itemSets[i] = new RandomItemSet(stream);
        }
    },

    save(stream) {
        stream.writeInt32(this.id);
        stream.write(`${this.name}\0`);
        stream.writeUint32(this.itemSets.length);

        for (let itemSet of this.itemSets) {
            itemSet.save(stream);
        }
    },

    calcSize() {
        let size = 9 + this.name.length;

        for (let itemSet of this.itemSets) {
            size += itemSet.calcSize();
        }

        return size;
    }
};

export default RandomItemGroup;
