function Doodad(stream, version) {
    this.id = '\0\0\0\0';
    this.variation = 0;
    this.location = new Float32Array(3);
    this.angle = 0;
    this.scale = new Float32Array(3);
    this.flags = 0;
    this.life = 0;
    this.editorId = 0;
    this.u1 = new Uint8Array(8);

    if (stream) {
        this.load(stream, version);
    }
}

Doodad.prototype = {
    load(stream, version) {
        this.id = stream.read(4);
        this.variation = stream.readInt32();
        this.location = stream.readFloat32Array(3);
        this.angle = stream.readFloat32();
        this.scale = stream.readFloat32Array(3);
        this.flags = stream.readUint8();
        this.life = stream.readUint8();
        this.editorId = stream.readInt32();
    
        if (version  > 7) {
            this.u1 = stream.readUint8Array(8);
        }
    },

    save(stream, version) {
        stream.write(this.id);
        stream.writeInt32(this.variation);
        stream.writeFloat32Array(this.location);
        stream.writeFloat32(this.angle);
        stream.writeFloat32Array(this.scale);
        stream.writeUint8(this.flags);
        stream.writeUint8(this.life);
        stream.writeUint32(this.editorId);

        if (version > 7) {
            stream.writeUint8Array(this.u1);
        }
    }
};

export default Doodad;
