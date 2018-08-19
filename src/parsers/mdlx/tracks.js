/**
 * A templated animation track.
 *
 * @param {Uint32Array|Float32Array} DataType
 * @param {number} size
 * @return {class}
 */
const templatedTrack = (DataType, size) => class {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.frame = 0;
    /** @member {Uint32Array|Float32Array} */
    this.value = new DataType(size);
    /** @member {Uint32Array|Float32Array} */
    this.inTan = new DataType(size);
    /** @member {Uint32Array|Float32Array} */
    this.outTan = new DataType(size);
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} interpolationType
   */
  readMdx(stream, interpolationType) {
    this.frame = stream.readUint32();
    stream.readTypedArray(this.value);

    if (interpolationType > 1) {
      stream.readTypedArray(this.inTan);
      stream.readTypedArray(this.outTan);
    }
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} interpolationType
   */
  writeMdx(stream, interpolationType) {
    stream.writeUint32(this.frame);
    stream.writeTypedArray(this.value);

    if (interpolationType > 1) {
      stream.writeTypedArray(this.inTan);
      stream.writeTypedArray(this.outTan);
    }
  }

  /**
   * @param {TokenStream} stream
   * @param {number} interpolationType
   */
  readMdl(stream, interpolationType) {
    this.frame = stream.readInt();
    stream.readKeyframe(this.value);

    if (interpolationType > 1) {
      stream.read(); // InTan
      stream.readKeyframe(this.inTan);
      stream.read(); // OutTan
      stream.readKeyframe(this.outTan);
    }
  }

  /**
   * @param {TokenStream} stream
   * @param {number} interpolationType
   */
  writeMdl(stream, interpolationType) {
    stream.writeKeyframe(`${this.frame}:`, this.value);

    if (interpolationType > 1) {
      stream.indent();
      stream.writeKeyframe('InTan', this.inTan);
      stream.writeKeyframe('OutTan', this.outTan);
      stream.unindent();
    }
  }

  /**
   * @param {number} interpolationType
   * @return {number}
   */
  getByteLength(interpolationType) {
    let valueSize = this.value.byteLength;
    let size = 4 + valueSize;

    if (interpolationType > 1) {
      size += valueSize * 2;
    }

    return size;
  }
};

/**
 * A uint track.
 */
export const UintTrack = templatedTrack(Uint32Array, 1);

/**
 * A float track.
 */
export const FloatTrack = templatedTrack(Float32Array, 1);

/**
 * A vector 3 track.
 */
export const Vector3Track = templatedTrack(Float32Array, 3);

/**
 * A vector 4 track.
 */
export const Vector4Track = templatedTrack(Float32Array, 4);
