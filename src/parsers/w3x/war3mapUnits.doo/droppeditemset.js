import DroppedItem from './droppeditem';

function DroppedItemSet(stream) {
    this.items = [];

    if (stream) {
        this.load(stream);
    }
}

DroppedItemSet.prototype = {
    load(stream) {
        for (let i = 0, l = stream.readInt32() ; i < l; i++) {
            this.items[i] = new DroppedItem(stream);
        }
    },

    save(stream) {
        stream.writeInt32(this.items.length);

        for (let item of this.items) {
            item.save(stream);
        }
    },

    calcSize() {
        return 4 + this.items.length * 8;
    }
};

export default DroppedItemSet;
