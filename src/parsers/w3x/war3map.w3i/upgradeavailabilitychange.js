function UpgradeAvailabilityChange(stream) {
    this.playerFlags = 0;
    this.id = '\0\0\0\0';
    this.levelAffected = 0;
    this.availability = 0;

    if (stream) {
        this.load(stream);
    }
}

UpgradeAvailabilityChange.prototype = {
    load(stream) {
        this.playerFlags = stream.readUint32();
        this.id = stream.read(4);
        this.levelAffected = stream.readInt32();
        this.availability = stream.readInt32();
    },

    save(stream) {
        stream.writeUint32(this.playerFlags);
        stream.write(this.id);
        stream.writeInt32(this.levelAffected);
        stream.writeInt32(this.availability);
    },

    calcSize() {
        return 16;
    }
};

export default UpgradeAvailabilityChange;
