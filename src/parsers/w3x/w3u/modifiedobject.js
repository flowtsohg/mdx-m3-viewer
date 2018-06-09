import Modification from './modification';

/**
 * A modified object.
 */
export default class ModifiedObject {
  /**
   *
   */
  constructor() {
    /** @member {string} */
    this.oldId = '\0\0\0\0';
    /** @member {string} */
    this.newId = '\0\0\0\0';
    /** @member {Array<Modification>} */
    this.modifications = [];
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} useOptionalInts
   */
  load(stream, useOptionalInts) {
    this.oldId = stream.read(4);
    this.newId = stream.read(4);

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let modification = new Modification();

      modification.load(stream, useOptionalInts);

      this.modifications[i] = modification;
    }
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} useOptionalInts
   */
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
  }

  /**
   * @param {number} useOptionalInts
   * @return {number}
   */
  getByteLength(useOptionalInts) {
    let size = 12;

    for (let modification of this.modifications) {
      size += modification.getByteLength(useOptionalInts);
    }

    return size;
  }
}
