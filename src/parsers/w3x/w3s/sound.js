/**
 * A sound.
 */
export default class Sound {
  /**
   *
   */
  constructor() {
    /** @member {string} */
    this.name = '';
    /** @member {string} */
    this.file = '';
    /** @member {string} */
    this.eaxEffect = '';
    /** @member {number} */
    this.flags = 0;
    /** @member {number} */
    this.fadeInRate = 0;
    /** @member {number} */
    this.fadeOutRate = 0;
    /** @member {number} */
    this.volume = 0;
    /** @member {number} */
    this.pitch = 0;
    /** @member {number} */
    this.u1 = 0;
    /** @member {number} */
    this.u2 = 0;
    /** @member {number} */
    this.channel = 0;
    /** @member {number} */
    this.minDistance = 0;
    /** @member {number} */
    this.maxDistance = 0;
    /** @member {number} */
    this.distanceCutoff = 0;
    /** @member {number} */
    this.u3 = 0;
    /** @member {number} */
    this.u4 = 0;
    /** @member {number} */
    this.u5 = 0;
    /** @member {number} */
    this.u6 = 0;
    /** @member {number} */
    this.u7 = 0;
    /** @member {number} */
    this.u8 = 0;
  }

  /**
   * @param {BinaryStream} stream
   */
  load(stream) {
    this.name = stream.readUntilNull();
    this.file = stream.readUntilNull();
    this.eaxEffect = stream.readUntilNull();
    this.flags = stream.readUint32();
    this.fadeInRate = stream.readInt32();
    this.fadeOutRate = stream.readInt32();
    this.volume = stream.readInt32();
    this.pitch = stream.readFloat32();
    this.u1 = stream.readFloat32();
    this.u2 = stream.readInt32();
    this.channel = stream.readInt32();
    this.minDistance = stream.readFloat32();
    this.maxDistance = stream.readFloat32();
    this.distanceCutoff = stream.readFloat32();
    this.u3 = stream.readFloat32();
    this.u4 = stream.readFloat32();
    this.u5 = stream.readInt32();
    this.u6 = stream.readFloat32();
    this.u7 = stream.readFloat32();
    this.u8 = stream.readFloat32();
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.write(`${this.name}\0`);
    stream.write(`${this.file}\0`);
    stream.write(`${this.eaxEffect}\0`);
    stream.writeUint32(this.flags);
    stream.writeUint32(this.fadeInRate);
    stream.writeUint32(this.fadeOutRate);
    stream.writeUint32(this.volume);
    stream.writeFloat32(this.pitch);
    stream.writeFloat32(this.u1);
    stream.writeInt32(this.u2);
    stream.writeInt32(this.channel);
    stream.writeFloat32(this.minDistance);
    stream.writeFloat32(this.maxDistance);
    stream.writeFloat32(this.distanceCutoff);
    stream.writeFloat32(this.u3);
    stream.writeFloat32(this.u4);
    stream.writeInt32(this.u5);
    stream.writeFloat32(this.u6);
    stream.writeFloat32(this.u7);
    stream.writeFloat32(this.u8);
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 71 + this.name.length + this.file.length + this.eaxEffect.length;
  }
}
