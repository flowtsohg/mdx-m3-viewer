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

    /// So far I only saw this sequence of bytes:
    /// [0, 0, 128, 63, 0, 0, 128, 63, 0, 0, 128, 63, 0, 0, 128, 63, 0, 0, 128, 63, 0, 0, 128, 63, 0, 0, 128, 63, 0, 0, 0, 0]
    this.maybeColors = new Uint8Array(32);

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

    stream.readUint8Array(this.maybeColors);
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

    stream.writeUint32Array(this.maybeColors);
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

