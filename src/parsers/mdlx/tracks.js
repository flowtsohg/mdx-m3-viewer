class Track {
    constructor() {
        this.frame = 0;
    }
}

export class NumberTrack extends Track {
    constructor() {
        super();

        this.value = 0;
        this.inTan = 0;
        this.outTan = 0;
    }

    readMdx(stream, interpolationType) {
        this.frame = stream.readUint32();
        this.value = this.readMdxValue(stream);

        if (interpolationType > 1) {
            this.inTan = this.readMdxValue(stream);
            this.outTan = this.readMdxValue(stream);
        }
    }

    writeMdx(stream, interpolationType) {
        stream.writeUint32(this.frame);
        this.writeMdxValue(stream, this.value);

        if (interpolationType > 1) {
            this.writeMdxValue(stream, this.inTan);
            this.writeMdxValue(stream, this.outTan);
        }
    }

    readMdl(stream, interpolationType) {
        this.frame = stream.readInt();
        this.value = this.readMdlValue(stream);

        if (interpolationType > 1) {
            stream.read(); // InTan
            this.inTan = this.readMdlValue(stream);
            stream.read(); // OutTan
            this.outTan = this.readMdlValue(stream);
        }
    }

    writeMdl(stream, interpolationType) {
        stream.writeAttrib(`${this.frame}:`, this.value);

        if (interpolationType > 1) {
            stream.indent();
            stream.writeAttrib('InTan', this.inTan);
            stream.writeAttrib('OutTan', this.outTan);
            stream.unindent();
        }
    }
};

class VectorTrack extends Track {
    constructor() {
        super();

        let length = this.valueLength();

        this.value = new Float32Array(length);
        this.inTan = new Float32Array(length);
        this.outTan = new Float32Array(length);
    }

    readMdx(stream, interpolationType) {
        this.frame = stream.readUint32();
        stream.readFloat32Array(this.value);

        if (interpolationType > 1) {
            stream.readFloat32Array(this.inTan);
            stream.readFloat32Array(this.outTan);
        }
    }

    writeMdx(stream, interpolationType) {
        stream.writeUint32(this.frame);
        stream.writeFloat32Array(this.value);

        if (interpolationType > 1) {
            stream.writeFloat32Array(this.inTan);
            stream.writeFloat32Array(this.outTan);
        }
    }

    readMdl(stream, interpolationType) {
        this.frame = stream.readInt();
        stream.readFloatArray(this.value);

        if (interpolationType > 1) {
            stream.read(); // InTan
            stream.readFloatArray(this.inTan);
            stream.read(); // OutTan
            stream.readFloatArray(this.outTan);
        }
    }

    writeMdl(stream, interpolationType) {
        stream.writeArrayAttrib(`${this.frame}:`, this.value);

        if (interpolationType > 1) {
            stream.indent();
            stream.writeArrayAttrib('InTan', this.inTan);
            stream.writeArrayAttrib('OutTan', this.outTan);
            stream.unindent();
        }
    }
}

export class UintTrack extends NumberTrack {
    readMdxValue(stream) {
        return stream.readUint32();
    }

    writeMdxValue(stream, value) {
        stream.writeUint32(value);
    }

    readMdlValue(stream) {
        return stream.readInt();
    }
};

export class FloatTrack extends NumberTrack {
    readMdxValue(stream) {
        return stream.readFloat32();
    }

    writeMdxValue(stream, value) {
        stream.writeFloat32(value);
    }

    readMdlValue(stream) {
        return stream.readFloat();
    }
};

export class Vector3Track extends VectorTrack {
    valueLength() {
        return 3;
    }
};

export class Vector4Track extends VectorTrack {
    valueLength() {
        return 4;
    }
};
