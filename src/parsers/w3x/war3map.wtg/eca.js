import Parameter from './parameter';
import { weuParamCount } from './weu';

export default class ECA {
    constructor() {
        this.type = 0;
        this.group = -1;
        this.name = '';
        this.isEnabled = 0;
        this.parameters = [];
        this.ecas = [];
    }

    load(stream, version, isChildECA, argumentMap) {
        this.type = stream.readInt32();

        if (isChildECA) {
            this.group = stream.readUint32();
        }

        this.name = stream.readUntilNull();
        this.isEnabled = stream.readInt32();

        let argumentsCount = argumentMap.get(this.name.toLowerCase());

        if (isNaN(argumentsCount)) {
            argumentsCount = weuParamCount(this.name);

            if (isNaN(argumentsCount)) {
                throw new Error(`Unknown ECA '${this.name}'`);
            }
        }

        for (let i = 0; i < argumentsCount; i++) {
            let parameter = new Parameter();

            parameter.load(stream, version, argumentMap);

            this.parameters[i] = parameter;
        }

        if (version === 7) {
            for (let i = 0, l = stream.readUint32(); i < l; i++) {
                let eca = new ECA();

                eca.load(stream, version, true, argumentMap);

                this.ecas[i] = eca;
            }
        }
    }

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
            stream.writeUint32(this.ecas.length);

            for (let eca of this.ecas) {
                eca.save(stream, version);
            }
        }
    }

    /**
     * @param {number} version 
     * @returns {number} 
     */
    getByteLength(version) {
        let size = 9 + this.name.length;

        if (this.group !== -1) {
            size += 4;
        }

        for (let parameter of this.parameters) {
            size += parameter.getByteLength(version);
        }

        if (version === 7) {
            size += 4;

            for (let eca of this.ecas) {
                size += eca.getByteLength(version);
            }
        }

        return size;
    }

    fromCustomScriptCode(code) {
        this.name = 'CustomScriptCode';

        // Remove any existing parameters and ECAs.
        this.parameters.length = 0;
        this.ecas.length = 0;

        let parameter = new Parameter();

        parameter.type = 3; // String
        parameter.value = code; // Jass code

        this.parameters[0] = parameter;
    }

    toCustomScriptCode() {
        return `call ${this.name}(${this.parameters.map((value) => value.toCustomScriptCode()).join(', ')})`;
    }
};
