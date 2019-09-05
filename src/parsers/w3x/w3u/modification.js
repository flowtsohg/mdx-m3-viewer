/**
 * A modification.
 */
export default class Modification {
  /**
   *
   */
  constructor() {
    /** @member {string} */
    this.id = '\0\0\0\0';
    /** @member {number} */
    this.variableType = 0;
    /** @member {number} */
    this.levelOrVariation = 0;
    /** @member {number} */
    this.dataPointer = 0;
    /** @member {number} */
    this.value = 0;
    /** @member {number} */
    this.u1 = 0;
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} useOptionalInts
   */
  load(stream, useOptionalInts) {
    this.id = stream.read(4);
    this.variableType = stream.readInt32();

    if (useOptionalInts) {
      this.levelOrVariation = stream.readInt32();
      this.dataPointer = stream.readInt32();
    }

    if (this.variableType === 0) {
      this.value = stream.readInt32();
    } else if (this.variableType === 1 || this.variableType === 2) {
      this.value = stream.readFloat32();
    } else if (this.variableType === 3) {
      this.value = stream.readUntilNull();
    } else {
      throw new Error(`Modification: unknown variable type ${this.variableType}`);
    }

    this.u1 = stream.readInt32();
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} useOptionalInts
   */
  save(stream, useOptionalInts) {
    stream.write(this.id);
    stream.writeInt32(this.variableType);

    if (useOptionalInts) {
      stream.writeInt32(this.levelOrVariation);
      stream.writeInt32(this.dataPointer);
    }

    if (this.variableType === 0) {
      stream.writeInt32(this.value);
    } else if (this.variableType === 1 || this.variableType === 2) {
      stream.writeFloat32(this.value);
    } else if (this.variableType === 3) {
      stream.write(`${this.value}\0`);
    } else {
      throw new Error(`Modification: unknown variable type ${this.variableType}`);
    }

    stream.writeInt32(this.u1);
  }

  /**
   * @param {number} useOptionalInts
   * @return {number}
   */
  getByteLength(useOptionalInts) {
    let size = 12;

    if (useOptionalInts) {
      size += 8;
    }

    if (this.variableType === 3) {
      size += 1 + this.value.length;
    } else {
      size += 4;
    }

    return size;
  }
}
