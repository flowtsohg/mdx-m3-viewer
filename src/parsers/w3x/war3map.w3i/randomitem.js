function RandomItem(stream) {
    this.chance = 0;
    this.ids = [];

    if (stream) {
        this.load(stream, positions);
    }
}

RandomItem.prototype = {
    load(stream) {
        this.chance = stream.readInt32();
        this.id = stream.read(4);
    },

    save(stream) {
        stream.writeInt32(this.chance);
        stream.write(this.id);
    }
};

export default RandomItem;
