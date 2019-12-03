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

    /** @member {number} */
    this.lifeSpan = 0;
    /** @member {number} */
    this.emissionRate = 0;
    /** @member {number} */
    this.speed = 0;
    /** @member {number} */
    this.color = new Float32Array(4);
    /** @member {number} */
    this.replaceableId = 0;
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

    this.lifeSpan = stream.readFloat32();
    this.emissionRate = stream.readFloat32();
    this.speed = stream.readFloat32();
    stream.readFloat32Array(this.color);
    this.replaceableId = stream.readUint32();
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

    stream.writeFloat32(this.lifeSpan);
    stream.writeFloat32(this.emissionRate);
    stream.writeFloat32(this.speed);
    stream.writeFloat32Array(this.color);
    stream.writeUint32(this.replaceableId);
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

