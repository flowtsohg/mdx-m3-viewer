function SpecialDoodad(stream, version) {
    this.id = '\0\0\0\0';
    this.u1 = new Uint8Array(4);
    this.location = new Float32Array(2);

    if (stream) {
        this.load(stream, version);
    }
}

SpecialDoodad.prototype = {
    load(stream, version) {
        this.id = reader.read(4);
        this.u1 = stream.readUint8Array(4);
        this.location = reader.readFloat32Array(2);
    },

    save(stream, version) {
        stream.write(this.id);
        stream.writeUint8Array(this.u1);
        stream.writeFloat32Array(this.location);
    }
};

export default SpecialDoodad;
