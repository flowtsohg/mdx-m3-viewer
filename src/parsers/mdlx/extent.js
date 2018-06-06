/**
 * An extent.
 */
export default class Extent {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.boundsRadius = 0;
    /** @member {Float32Array} */
    this.min = new Float32Array(3);
    /** @member {Float32Array} */
    this.max = new Float32Array(3);
  }

  /**
   * @param {BinaryStream} stream
   */
  readMdx(stream) {
    this.boundsRadius = stream.readFloat32();
    stream.readFloat32Array(this.min);
    stream.readFloat32Array(this.max);
  }

  /**
   * @param {BinaryStream} stream
   */
  writeMdx(stream) {
    stream.writeFloat32(this.boundsRadius);
    stream.writeFloat32Array(this.min);
    stream.writeFloat32Array(this.max);
  }

  /**
   * @param {TokenStream} stream
   */
  writeMdl(stream) {
    if (this.min[0] !== 0 || this.min[1] !== 0 || this.min[2] !== 0) {
      stream.writeFloatArrayAttrib('MinimumExtent', this.min);
    }

    if (this.max[0] !== 0 || this.max[1] !== 0 || this.max[2] !== 0) {
      stream.writeFloatArrayAttrib('MaximumExtent', this.max);
    }

    if (this.boundsRadius !== 0) {
      stream.writeFloatAttrib('BoundsRadius', this.boundsRadius);
    }
  }
}
