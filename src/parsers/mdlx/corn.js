import GenericObject from './genericobject';

/**
 * A corn.
 * Corns are particle emitters that reference pkfx files, which are used by the PopcornFX runtime.
 *
 * @since 900
 */
export default class Corn extends GenericObject {
  /**
   *
   */
  constructor() {
    super(0); /// What is the flag?

    /** @member {Float32Array} */
    this.color0 = new Float32Array(4);
    /** @member {Float32Array} */
    this.color1 = new Float32Array(4);
    /** @member {string} */
    this.path = '';
    /** @member {string} */
    this.flags = '';
  }

  /**
   * @param {BinaryStream} stream
   */
  readMdx(stream) {
    const start = stream.index;
    const size = stream.readUint32();

    super.readMdx(stream);

    stream.readFloat32Array(this.color0);
    stream.readFloat32Array(this.color1);
    this.path = stream.read(260);
    this.flags = stream.read(260);

    this.readAnimations(stream, size - (stream.index - start));
  }

  /**
   * @param {BinaryStream} stream
   */
  writeMdx(stream) {
    stream.writeUint32(this.getByteLength());

    super.writeMdx(stream);

    stream.writeFloat32Array(this.color0);
    stream.writeFloat32Array(this.color1);
    stream.write(this.path);
    stream.skip(260 - this.path.length);
    stream.write(this.flags);
    stream.skip(260 - this.flags.length);

    this.writeNonGenericAnimationChunks(stream);
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 556 + super.getByteLength();
  }
}

