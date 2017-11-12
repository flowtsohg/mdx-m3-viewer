function Player(stream) {
    this.id = 0;
    this.type = 0;
    this.race = 0;
    this.isFixedStartPosition = 0;
    this.name = '';
    this.startLocation = new Float32Array(2);
    this.allyLowPriorities = 0;
    this.allyHighPriorities = 0;

    if (stream) {
        this.load(stream);
    }
}

Player.prototype = {
    load(stream) {
        this.id = stream.readInt32();
        this.type = stream.readInt32();
        this.race = stream.readInt32();
        this.isFixedStartPosition = stream.readInt32();
        this.name = stream.readUntilNull();
        this.startLocation = stream.readFloat32Array(2);
        this.allyLowPriorities = stream.readUint32();
        this.allyHighPriorities = stream.readUint32();
    },

    save(stream) {
        stream.writeInt32(this.id);
        stream.writeInt32(this.type);
        stream.writeInt32(this.race);
        stream.writeInt32(this.isFixedStartPosition);
        stream.write(`${this.name}\0`);
        stream.writeFloat32Array(this.startLocation);
        stream.writeUint32(this.allyLowPriorities);
        stream.writeUint32(this.allyHighPriorities);
    },

    calcSize() {
        return 33 + this.name.length;
    }
};

export default Player;
