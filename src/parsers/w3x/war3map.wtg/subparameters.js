import Parameter from './parameter';
import fixWeu from './weu';

function SubParameters(stream, version, argumentMap) {
    this.type = 0;
    this.name = '';
    this.parameters = [];

    if (stream) {
        this.load(stream, version, argumentMap);
    }
}

SubParameters.prototype = {
    load(stream, version, argumentMap) {
        this.type = stream.readInt32();
        this.name = stream.readUntilNull();
        this.beginParameters = stream.readInt32();

        if (this.beginParameters) {
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
        }
    },

    save(stream, version) {
        stream.writeInt32(this.type);
        stream.write(`${this.name}\0`);
        stream.writeInt32(this.beginParameters);
        
        for (let parameter of this.parameters) {
            parameter.save(stream, version);
        }
    },

    calcSize(version) {
        let size = 9 + this.name.length;

        if (this.parameters.length) {
            for (let parameter of this.parameters) {
                size += parameter.calcSize(version);
            }
        }

        return size;
    }
};

export default SubParameters;
