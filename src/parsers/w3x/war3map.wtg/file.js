import BinaryStream from '../../../common/binarystream';
import TriggerCategory from './triggercategory';
import Variable from './variable';
import Trigger from './trigger';

export default class War3MapWtg {
    constructor(buffer, functions) {
        this.version = 0;
        this.triggerCategories = [];
        this.u1 = 0;
        this.variables = [];
        this.triggers = [];

        if (buffer) {
            this.load(buffer, functions);
        }
    }

    load(buffer, functions) {
        let stream = new BinaryStream(buffer);

        if (stream.read(4) !== 'WTG!') {
            return false;
        }

        this.version = stream.readInt32();

        for (let i = 0, l = stream.readUint32(); i < l; i++) {
            let triggerCategory = new TriggerCategory();

            triggerCategory.load(stream, this.version);

            this.triggerCategories[i] = triggerCategory;
        }

        this.u1 = stream.readInt32();

        for (let i = 0, l = stream.readUint32(); i < l; i++) {
            let variable = new Variable();

            variable.load(stream, this.version);

            this.variables[i] = variable;
        }

        for (let i = 0, l = stream.readUint32(); i < l; i++) {
            let trigger = new Trigger();

            trigger.load(stream, this.version, functions);

            this.triggers[i] = trigger;
        }
    }

    save() {
        let buffer = new ArrayBuffer(this.getByteLength()),
            stream = new BinaryStream(buffer);

        stream.write('WTG!');
        stream.writeInt32(this.version);
        stream.writeUint32(this.triggerCategories.length);

        for (let triggerCategory of this.triggerCategories) {
            triggerCategory.save(stream, this.version);
        }

        stream.writeInt32(this.u1);
        stream.writeUint32(this.variables.length);

        for (let variable of this.variables) {
            variable.save(stream, this.version);
        }

        stream.writeUint32(this.triggers.length);

        for (let trigger of this.triggers) {
            trigger.save(stream, this.version);
        }

        return buffer;
    }

    /**
     * @return {number}
     */
    getByteLength() {
        let size = 24;

        for (let triggerCategory of this.triggerCategories) {
            size += triggerCategory.getByteLength(this.version);
        }

        for (let variable of this.variables) {
            size += variable.getByteLength(this.version);
        }

        for (let trigger of this.triggers) {
            size += trigger.getByteLength(this.version);
        }

        return size;
    }
};
