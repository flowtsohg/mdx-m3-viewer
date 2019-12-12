import BinaryStream from '../../../common/binarystream';
import ModifiedObject from './modifiedobject';

/**
 * A modification table.
 */
export default class ModificationTable {
  objects: ModifiedObject[] = [];

  load(stream: BinaryStream, useOptionalInts: boolean) {
    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let object = new ModifiedObject();

      object.load(stream, useOptionalInts);

      this.objects[i] = object;
    }
  }

  save(stream: BinaryStream, useOptionalInts: boolean) {
    stream.writeUint32(this.objects.length);

    for (let object of this.objects) {
      object.save(stream, useOptionalInts);
    }
  }

  getByteLength(useOptionalInts: boolean) {
    let size = 4;

    for (let object of this.objects) {
      size += object.getByteLength(useOptionalInts);
    }

    return size;
  }
}
