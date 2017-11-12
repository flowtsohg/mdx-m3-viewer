function RandomUnit(stream, positions) {
    this.chance = 0;
    this.ids = [];

    if (stream) {
        this.load(stream, positions);
    }
}

RandomUnit.prototype = {
    load(stream, positions) {
        this.chance = stream.readInt32();

        for (let i = 0; i < positions; i++) {
            this.ids[i] = stream.read(4);
        }
    },

    save(stream) {
        stream.writeInt32(this.chance);

        for (let id of this.ids) {
            stream.write(id);
        }
    }
};

export default RandomUnit;
