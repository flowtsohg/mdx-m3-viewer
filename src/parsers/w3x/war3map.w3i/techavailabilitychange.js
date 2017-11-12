
function TechAvailabilityChange(stream) {
    this.playerFlags = 0;
    this.id = '\0\0\0\0';

    if (stream) {
        this.load(stream);
    }
}

TechAvailabilityChange.prototype = {
    load(stream) {
        this.playerFlags = stream.readUint32();
        this.id = stream.read(4);
    },

    save(stream) {
        stream.writeUint32(this.playerFlags);
        stream.write(this.id);
    },

    calcSize() {
        return 8;
    }
};

export default TechAvailabilityChange;
