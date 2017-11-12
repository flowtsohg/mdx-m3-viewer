function MinimapIcon(stream) {
    this.type = 0;
    this.location = new Int32Array(2);
    this.color = new Uint8Array(4); // BGRA

    if (stream) {
        this.load(stream);
    }
}

MinimapIcon.prototype = {
    load(stream) {
        this.type = stream.readInt32();
        this.location = stream.readInt32Array(2);
        this.color = stream.readUint8Array(4);
    },

    save(stream) {
        stream.writeInt32(this.type);
        stream.writeInt32Array(this.location);
        stream.writeUint8Array(this.color);
    }
};

export default MinimapIcon;
