import Parameter from './parameter';
import fixWeu from './weu';

function ECA(stream, version, isChildECA, argumentMap) {
    this.type = 0;
    this.group = -1;
    this.name = '';
    this.isEnabled = 0;
    this.parameters = [];
    this.ecas = [];

    if (stream) {
        this.load(stream, version, isChildECA, argumentMap);
    }
}

ECA.prototype = {
    load(stream, version, isChildECA, argumentMap) {
        this.type = stream.readInt32();

        if (isChildECA) {
            this.group = stream.readUint32();
        }

        this.name = stream.readUntilNull();
        this.isEnabled = stream.readInt32();

        let argumentsCount = argumentMap.get(this.name.toLowerCase());
        
        if (isNaN(argumentsCount)) {
            argumentsCount = fixWeu(this.name);

            if (isNaN(argumentsCount)) {
                throw new Error(`Unknown ECA '${this.name}'`);
            }
        }

        for (let i = 0; i < argumentsCount; i++) {
            this.parameters[i] = new Parameter(stream, version, argumentMap);
        }

        if (version === 7) {
            for (let i = 0, l = stream.readUint32(); i < l; i++) {
                this.ecas[i] = new ECA(stream, version, true, argumentMap);
            }
        }
    },

    save(stream, version) {
        stream.writeInt32(this.type);

        if (this.group !== -1) {
            stream.writeInt32(this.group);
        }

        stream.write(`${this.name}\0`);
        stream.writeInt32(this.isEnabled);

        for (let parameter of this.parameters) {
            parameter.save(stream, version);
        }

        if (version === 7) {
            stream.writeUint32(this.eca.length);

            for (let eca of this.ecas) {
                eca.save(stream, version);
            }
        }
    },

    calcSize(version) {
        let size = 9 + this.name.length;

        if (this.group !== -1) {
            size += 4;
        }

        for (let parameter of this.parameters) {
            size += parameter.calcSize(version);
        }

        if (version === 7) {
            size += 4;

            for (let eca of this.ecas) {
                size += eca.calcSize(version);
            }
        }

        return size;
    }
};

export default ECA;
