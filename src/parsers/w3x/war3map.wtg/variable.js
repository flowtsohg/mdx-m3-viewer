export default class Variable {
    constructor() {
        this.name = '';
        this.type = '';
        this.u1 = 0;
        this.isArray = 0;
        this.arraySize = 0;
        this.isInitialized = 0;
        this.initialValue = '';
    }

    load(stream, version) {
        this.name = stream.readUntilNull();
        this.type = stream.readUntilNull();
        this.u1 = stream.readInt32();
        this.isArray = stream.readInt32();

        if (version === 7) {
            this.arraySize = stream.readInt32();
        }

        this.isInitialized = stream.readInt32();
        this.initialValue = stream.readUntilNull();
    }

    save(stream, version) {
        stream.write(`${this.name}\0`);
        stream.write(`${this.type}\0`);
        stream.writeInt32(this.u1);
        stream.writeInt32(this.isArray);

        if (version === 7) {
            stream.writeInt32(this.arraySize);
        }

        stream.writeInt32(this.isInitialized);
        stream.write(`${this.initialValue}\0`);
    }

    /**
     * @param {number} version 
     * @returns {number} 
     */
    getByteLength(version) {
        let size = 15 + this.name.length + this.type.length + this.initialValue.length;

        if (version === 7) {
            size += 4;
        }

        return size;
    }
};
