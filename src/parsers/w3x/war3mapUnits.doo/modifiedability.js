function ModifiedAbility(stream) {
    this.id = '\0\0\0\0';
    this.activeForAutocast = 0;
    this.heroLevel = 1;

    if (stream) {
        this.load(stream);
    }
}

ModifiedAbility.prototype = {
    load(stream) {
        this.id = stream.read(4);
        this.activeForAutocast = stream.readInt32();
        this.heroLevel = stream.readInt32();
    },

    save(stream) {
        stream.write(this.id);
        stream.writeInt32(this.activeForAutocast);
        stream.writeInt32(this.heroLevel);
    }
};

export default ModifiedAbility;
