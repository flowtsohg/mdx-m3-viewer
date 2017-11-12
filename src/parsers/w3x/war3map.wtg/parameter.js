import SubParameters from './subparameters';

function Parameter(stream, version, argumentMap) {
    this.type = 0;
    this.value = '';
    this.subParameters = null;
    this.u1 = 0;
    this.isArray = 0;
    this.arrayIndex = null;

    if (stream) {
        this.load(stream, version, argumentMap);
    }
}

Parameter.prototype = {
    load(stream, version, argumentMap) {
        this.type = stream.readInt32();
        this.value = stream.readUntilNull();

        if (stream.readInt32()) {
            this.subParameters = new SubParameters(stream, version, argumentMap);
        }

        if ((version === 4 && this.type === 2) || (version === 7 && this.subParameters)) {
            this.u1 = stream.readInt32();
        }

        if ((version === 4 && this.type !== 2) || version === 7) {
            this.isArray = stream.readInt32();
        }

        if (this.isArray) {
            this.arrayIndex = new Parameter(stream, version, argumentMap);
        }
    },

    save(stream, version) {
        stream.writeInt32(this.type);
        stream.write(`${this.value}\0`);

        if (this.subParameters) {
            stream.writeInt32(1);
            this.subParameters.save(stream, version);
        } else {
            stream.writeInt32(0);
        }
        
        if ((version === 4 && this.type === 2) || (version === 7 && this.subParameters)) {
            stream.writeInt32(this.u1);
        }
        
        if ((version === 4 && this.type !== 2) || version === 7) {
            stream.writeInt32(this.isArray);
        }
        
        if (this.isArray) {
            this.arrayIndex.save(stream, version);
        }
    },

    calcSize(version) {
        let size = 9 + this.value.length;

        if (this.subParameters) {
            size += this.subParameters.calcSize(version);
        }

        if ((version === 4 && this.type === 2) || (version === 7 && this.subParameters)) {
            size += 4;
        }
        
        if ((version === 4 && this.type !== 2) || version === 7) {
            size += 4;
        }

        if (this.isArray) {
            size += this.arrayIndex.calcSize(version);
        }

        return size;
    }
};

export default Parameter;
