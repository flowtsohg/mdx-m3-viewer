import BinaryStream from '../../../common/binarystream';
import Modification from './modification';

/**
 * A modified object.
 */
export default class ModifiedObject {
  oldId: string = '\0\0\0\0';
  newId: string = '\0\0\0\0';
  modifications: Modification[] = [];

  load(stream: BinaryStream, useOptionalInts: boolean) {
    this.oldId = stream.read(4);
    this.newId = stream.read(4);

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let modification = new Modification();

      modification.load(stream, useOptionalInts);

      this.modifications[i] = modification;
    }
  }

  save(stream: BinaryStream, useOptionalInts: boolean) {
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
  }

  getByteLength(useOptionalInts: boolean) {
    let size = 12;

    for (let modification of this.modifications) {
      size += modification.getByteLength(useOptionalInts);
    }

    return size;
  }
}
