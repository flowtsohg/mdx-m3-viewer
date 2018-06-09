import ModifiedObject from './modifiedobject';

/**
 * A modification table.
 */
export default class ModificationTable {
  /**
   *
   */
  constructor() {
    /** @member {Array<ModifiedObject>} */
    this.objects = [];
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} useOptionalInts
   */
  load(stream, useOptionalInts) {
    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let object = new ModifiedObject();

      object.load(stream, useOptionalInts);

      this.objects[i] = object;
    }
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} useOptionalInts
   */
  save(stream, useOptionalInts) {
    stream.writeUint32(this.objects.length);

    for (let object of this.objects) {
      object.save(stream, useOptionalInts);
    }
  }

  /**
   * @param {number} useOptionalInts
   * @return {number}
   */
  getByteLength(useOptionalInts) {
    let size = 4;

    for (let object of this.objects) {
      size += object.getByteLength(useOptionalInts);
    }

    return size;
  }
}
