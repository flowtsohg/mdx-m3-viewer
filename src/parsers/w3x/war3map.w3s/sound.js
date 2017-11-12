function Sound(stream) {
    this.name = '';
    this.file = '';
    this.eaxEffect = '';
    this.flags = 0;
    this.fadeInRate = 0;
    this.fadeOutRate = 0;
    this.volume = 0;
    this.pitch = 0;
    this.u1 = 0;
    this.u2 = 0;
    this.channel = 0;
    this.minDistance = 0;
    this.maxDistance = 0;
    this.distanceCutoff = 0;
    this.u3 = 0;
    this.u4 = 0;
    this.u5 = 0;
    this.u6 = 0;
    this.u7 = 0;
    this.u8 = 0;

    if (stream) {
        this.load(stream);
    }
}

Sound.prototype = {
    load(stream) {
        this.name = stream.readUntilNull();
        this.file = stream.readUntilNull();
        this.eaxEffect = stream.readUntilNull();
        this.flags = stream.readUint32();
        this.fadeInRate = stream.readInt32();
        this.fadeOutRate = stream.readInt32();
        this.volume = stream.readInt32();
        this.pitch = stream.readFloat32();
        this.u1 = stream.readFloat32();
        this.u2 = stream.readInt32();
        this.channel = stream.readInt32();
        this.minDistance = stream.readFloat32();
        this.maxDistance = stream.readFloat32();
        this.distanceCutoff = stream.readFloat32();
        this.u3 = stream.readFloat32();
        this.u4 = stream.readFloat32();
        this.u5 = stream.readInt32();
        this.u6 = stream.readFloat32();
        this.u7 = stream.readFloat32();
        this.u8 = stream.readFloat32();
    },

    save(stream) {
        stream.write(`${this.name}\0`);
        stream.write(`${this.file}\0`);
        stream.write(`${this.eaxEffect}\0`);
        stream.writeUint32(this.flags);
        stream.writeUint32(this.fadeInRate);
        stream.writeUint32(this.fadeOutRate);
        stream.writeUint32(this.volume);
        stream.writeFloat32(this.pitch);
        stream.writeFloat32(this.u1);
        stream.writeInt32(this.u2);
        stream.writeInt32(this.channel);
        stream.writeFloat32(this.minDistance);
        stream.writeFloat32(this.maxDistance);
        stream.writeFloat32(this.distanceCutoff);
        stream.writeFloat32(this.u3);
        stream.writeFloat32(this.u4);
        stream.writeInt32(this.u5);
        stream.writeFloat32(this.u6);
        stream.writeFloat32(this.u7);
        stream.writeFloat32(this.u8);
    },

    calcSize() {
        return 71 + this.name.length + this.file.length + this.eaxEffect.length;
    }
};

export default Sound;
