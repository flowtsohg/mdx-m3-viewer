function Modification(stream, useOptionalInts) {
    this.id = '\0\0\0\0';
    this.variableType = 0;
    this.levelOrVariation = 0;
    this.dataPointer = 0;
    this.value = 0;
    this.u1 = 0;

    if (stream) {
        this.load(stream, useOptionalInts);
    }
}

Modification.prototype = {
    load(stream, useOptionalInts) {
        this.id = stream.read(4);
        this.variableType = stream.readInt32();

        if (useOptionalInts) {
            this.levelOrVariation = stream.readInt32();
            this.dataPointer = stream.readInt32();
        }
        
        if (this.variableType === 0) {
            this.value = stream.readInt32();
        } else if (this.variableType === 1 || this.variableType === 2) {
            this.value = stream.readFloat32();
        } else if (this.variableType === 3) {
            this.value = stream.readUntilNull();
        } else {
            throw new Error(`Modification: unknown variable type ${variableType}`);
        }
    
        this.u1 = stream.readInt32();
    },

    save(stream, useOptionalInts) {
        stream.write(this.id);
        stream.writeInt32(this.variableType);

        if (useOptionalInts) {
            stream.writeInt32(this.levelOrVariation);
            stream.writeInt32(this.dataPointer);
        }

        if (this.variableType === 0) {
            stream.writeInt32(this.value);
        } else if (this.variableType === 1 || this.variableType === 2) {
            stream.writeFloat32(this.value);
        } else if (this.variableType === 3) {
            stream.write(`${this.value}\0`);
        } else {
            throw new Error(`Modification: unknown variable type ${variableType}`);
        }

        stream.writeInt32(this.u1);
    },

    calcSize(useOptionalInts) {
        let size = 12;

        if (useOptionalInts) {
            size += 8;
        }

        if (this.variableType === 3) {
            size += 1 + this.value.length;
        } else {
            size += 4;
        }

        return size;
    }
};

export default Modification;
