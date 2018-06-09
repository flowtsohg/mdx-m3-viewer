/**
 * A keyframe on a timeline.
 */
class Track {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.frame = 0;
    /** @member {Uint32Array|Float32Array} */
    this.value = this.dataType();
    /** @member {Uint32Array|Float32Array} */
    this.inTan = this.dataType();
    /** @member {Uint32Array|Float32Array} */
    this.outTan = this.dataType();
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
    stream.readTypedArray(this.value);

    if (interpolationType > 1) {
      stream.read(); // InTan
      stream.readTypedArray(this.inTan);
      stream.read(); // OutTan
      stream.readTypedArray(this.outTan);
    }
  }

  /**
   * @param {TokenStream} stream
   * @param {number} interpolationType
   */
  writeMdl(stream, interpolationType) {
    stream.writeTypedArrayAttrib(`${this.frame}:`, this.value);

    if (interpolationType > 1) {
      stream.indent();
      stream.writeTypedArrayAttrib('InTan', this.inTan);
      stream.writeTypedArrayAttrib('OutTan', this.outTan);
      stream.unindent();
    }
  }
}

/**
 * A uint track.
 */
export class UintTrack extends Track {
  /**
   * @return {Uint32Array}
   */
  dataType() {
    return new Uint32Array(1);
  }
}

/**
 * A float track.
 */
export class FloatTrack extends Track {
  /**
   * @return {Float32Array}
   */
  dataType() {
    return new Float32Array(1);
  }
}

/**
 * A vec3 track.
 */
export class Vector3Track extends Track {
  /**
   * @return {Float32Array}
   */
  dataType() {
    return new Float32Array(3);
  }
}

/**
 * A vec4 track.
 */
export class Vector4Track extends Track {
  /**
   * @return {Float32Array}
   */
  dataType() {
    return new Float32Array(4);
  }
}
