import Parameter from './parameter';

export default class SubParameters {
    constructor() {
        this.type = 0;
        this.name = '';
        this.parameters = [];
    }

    load(stream, version, argumentMap) {
        this.type = stream.readInt32();
        this.name = stream.readUntilNull();
        this.beginParameters = stream.readInt32();

        if (this.beginParameters) {
            let argumentsCount = argumentMap.get(this.name.toLowerCase());

            if (isNaN(argumentsCount)) {
                //argumentsCount = weuParamCount(this.name);

                //if (isNaN(argumentsCount)) {
                    throw new Error(`Unknown ECA '${this.name}'`);
                //}
            }

            for (let i = 0; i < argumentsCount; i++) {
                let parameter = new Parameter();

                parameter.load(stream, version, argumentMap);

                this.parameters[i] = parameter;
            }
        }
    }

    save(stream, version) {
        stream.writeInt32(this.type);
        stream.write(`${this.name}\0`);
        stream.writeInt32(this.beginParameters);

        for (let parameter of this.parameters) {
            parameter.save(stream, version);
        }
    }

    /**
     * @param {number} version 
     * @returns {number} 
     */
    getByteLength(version) {
        let size = 9 + this.name.length;

        if (this.parameters.length) {
            for (let parameter of this.parameters) {
                size += parameter.getByteLength(version);
            }
        }

        return size;
    }
};
