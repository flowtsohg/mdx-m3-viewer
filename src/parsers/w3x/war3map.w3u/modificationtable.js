import ModifiedObject from './modifiedobject';

function ModificationTable(stream, useOptionalInts) {
    this.objects = [];

    if (stream) {
        this.load(stream, useOptionalInts);
    }
}

ModificationTable.prototype = {
    load(stream, useOptionalInts) {
        for (let i = 0, l = stream.readUint32() ; i < l; i++) {
            this.objects[i] = new ModifiedObject(stream, useOptionalInts);
        }
    },

    save(stream, useOptionalInts) {
        stream.writeUint32(this.objects.length);

        for (let object of this.objects) {
            object.save(stream, useOptionalInts);
        }
    },

    calcSize(useOptionalInts) {
        let size = 4;
        
        for (let object of this.objects) {
            size += object.calcSize(useOptionalInts);
        }

        return size;
    }
};

export default ModificationTable;
