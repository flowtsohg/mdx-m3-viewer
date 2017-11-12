import Modification from './modification';

function ModifiedObject(stream, useOptionalInts) {
    this.oldId = '\0\0\0\0';
    this.newId = '\0\0\0\0';
    this.modifications = [];

    if (stream) {
        this.load(stream, useOptionalInts);
    }
}

ModifiedObject.prototype = {
    load(stream, useOptionalInts) {
        this.oldId = stream.read(4);
        this.newId = stream.read(4);
    
        for (let i = 0, l = stream.readUint32() ; i < l; i++) {
            this.modifications[i] = new Modification(stream, useOptionalInts);
        }
    },

    save(stream, useOptionalInts) {
        if (this.oldId) {
            stream.write(this.oldId);
        } else {
            stream.writeUint32(0);
        }

        if (this.newId) {
            stream.write(this.newId);
        } else {
            stream.writeUint32(0);
        }

        stream.writeUint32(this.modifications.length);

        for (let modification of this.modifications) {
            modification.save(stream, useOptionalInts);
        }
    },

    calcSize(useOptionalInts) {
        let size = 12;

        for (let modification of this.modifications) {
            size += modification.calcSize(useOptionalInts);
        }

        return size;
    }
};

export default ModifiedObject;
