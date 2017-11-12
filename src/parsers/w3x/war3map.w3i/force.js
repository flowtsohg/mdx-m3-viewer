function Force(stream) {
    this.flags = 0;
    this.playerMasks = 0;
    this.name = '';

    if (stream) {
        this.load(stream);
    }
}

Force.prototype = {
    load(stream) {
        this.flags = stream.readUint32();
        this.playerMasks = stream.readUint32();
        this.name = stream.readUntilNull();
    },

    save(stream) {
        stream.writeUint32(this.flags);
        stream.writeUint32(this.playerMasks);
        stream.write(`${this.name}\0`);
    },

    calcSize() {
        return 9 + this.name.length;
    }
};

export default Force;
