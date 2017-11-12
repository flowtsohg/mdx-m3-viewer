import RandomItem from './randomitem';

function RandomItemSet(stream) {
    this.items = [];

    if (stream) {
        this.load(stream);
    }
}

RandomItemSet.prototype = {
    load(stream) {
        for (let i = 0, l = stream.readUint32(); i < l; i++) {
            this.items[i] = new RandomItem(stream);
        }
    },

    save(stream) {
        stream.writeUint32(this.items.length);

        for (let item of this.items) {
            item.save(stream);
        }
    },

    calcSize() {
        return 4 + this.items.length * 8;
    }
};

export default RandomItemSet;
