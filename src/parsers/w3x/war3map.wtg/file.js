import BinaryStream from '../../../common/binarystream';
import TriggerCategory from './triggercategory';
import Variable from './variable';
import Trigger from './trigger';

/**
 * @constructor
 */
function War3MapWtg(buffer, argumentMap) {
    this.version = 0;
    this.triggerCategories = [];
    this.u1 = 0;
    this.variables = [];
    this.triggers = [];
    
    if (buffer) {
        this.load(buffer, argumentMap);
    }
}

War3MapWtg.prototype = {
    load(buffer, argumentMap) {
        let stream = new BinaryStream(buffer);

        if (stream.read(4) !== 'WTG!') {
            return false;
        }

        this.version = stream.readInt32();

        for (let i = 0, l = stream.readUint32(); i < l; i++) {
            this.triggerCategories[i] = new TriggerCategory(stream, this.version);
        }

        this.u1 = stream.readInt32();

        for (let i = 0, l = stream.readUint32(); i < l; i++) {
            this.variables[i] = new Variable(stream, this.version);
        }

        for (let i = 0, l = stream.readUint32(); i < l; i++) {
            this.triggers[i] = new Trigger(stream, this.version, argumentMap);
        }
    },

    save() {
        let buffer = new ArrayBuffer(this.calcSize()),
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
    },

    calcSize() {
        let size = 24;

        for (let triggerCategory of this.triggerCategories) {
            size += triggerCategory.calcSize(this.version);
        }

        for (let variable of this.variables) {
            size += variable.calcSize(this.version);
        }

        for (let trigger of this.triggers) {
            size += trigger.calcSize(this.version);
        }

        return size;
    }
};

export default War3MapWtg;
