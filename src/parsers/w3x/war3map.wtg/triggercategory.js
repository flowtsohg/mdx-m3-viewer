export default class TriggerCategory {
    constructor() {
        this.id = 0;
        this.name = '';
        this.isComment = 0;
    }

    load(stream, version) {
        this.id = stream.readInt32();
        this.name = stream.readUntilNull();

        if (version === 7) {
            this.isComment = stream.readInt32();
        }
    }

    save(stream, version) {
        stream.writeInt32(this.id);
        stream.write(`${this.name}\0`);

        if (version === 7) {
            stream.writeInt32(this.isComment);
        }
    }

    /**
     * @param {number} version 
     * @returns {number} 
     */
    getByteLength(version) {
        let size = 5 + this.name.length;

        if (version === 7) {
            size += 4;
        }

        return size;
    }
};
