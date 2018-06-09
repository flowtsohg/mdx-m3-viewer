/**
 * A region.
 */
export default class Region {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.left = 0;
    /** @member {number} */
    this.right = 0;
    /** @member {number} */
    this.bottom = 0;
    /** @member {number} */
    this.top = 0;
    /** @member {string} */
    this.name = '';
    /** @member {number} */
    this.creationNumber = 0;
    /** @member {string} */
    this.weatherEffectId = '\0\0\0\0';
    /** @member {string} */
    this.ambientSound = '';
    /** @member {Uint8Array} */
    this.color = new Uint8Array(4);
  }

  /**
   * @param {BinaryStream} stream
   */
  load(stream) {
    this.left = stream.readFloat32();
    this.right = stream.readFloat32();
    this.bottom = stream.readFloat32();
    this.top = stream.readFloat32();
    this.name = stream.readUntilNull();
    this.creationNumber = stream.readUint32();
    this.weatherEffectId = stream.read(4);
    this.ambientSound = stream.readUntilNull();
    this.color = stream.readUint8Array(4);
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.writeFloat32(this.left);
    stream.writeFloat32(this.right);
    stream.writeFloat32(this.bottom);
    stream.writeFloat32(this.top);
    stream.write(`${this.name}\0`);
    stream.writeUint32(this.creationNumber);

    if (this.weatherEffectId) {
      stream.write(this.weatherEffectId);
    } else {
      stream.writeUint32(0);
    }

    stream.write(`${this.ambientSound}\0`);
    stream.writeUint8Array(this.color);
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 30 + this.name.length + this.ambientSound.length;
  }
}
