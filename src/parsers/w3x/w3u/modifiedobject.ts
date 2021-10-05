import BinaryStream from '../../../common/binarystream';
import Modification from './modification';

/**
 * A modified object.
 */
export default class ModifiedObject {
  oldId = '\0\0\0\0';
  newId = '\0\0\0\0';
  modifications: Modification[] = [];

  load(stream: BinaryStream, useOptionalInts: boolean): void {
    this.oldId = stream.readBinary(4);
    this.newId = stream.readBinary(4);

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      const modification = new Modification();

      modification.load(stream, useOptionalInts);

      this.modifications[i] = modification;
    }
  }

  save(stream: BinaryStream, useOptionalInts: boolean): void {
    if (this.oldId !== '\0\0\0\0') {
      stream.writeBinary(this.oldId);
    } else {
      stream.writeUint32(0);
    }

    if (this.newId !== '\0\0\0\0') {
      stream.writeBinary(this.newId);
    } else {
      stream.writeUint32(0);
    }

    stream.writeUint32(this.modifications.length);

    for (const modification of this.modifications) {
      modification.save(stream, useOptionalInts);
    }
  }

  getByteLength(useOptionalInts: boolean): number {
    let size = 12;

    for (const modification of this.modifications) {
      size += modification.getByteLength(useOptionalInts);
    }

    return size;
  }
}
