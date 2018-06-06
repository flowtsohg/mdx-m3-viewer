import Extent from './extent';

/**
 * A sequence.
 */
export default class Sequence {
  /**
   *
   */
  constructor() {
    /** @member {string} */
    this.name = '';
    /** @member {Uint32Array} */
    this.interval = new Uint32Array(2);
    /** @member {number} */
    this.moveSpeed = 0;
    /** @member {number} */
    this.flags = 0;
    /** @member {number} */
    this.rarity = 0;
    /** @member {number} */
    this.syncPoint = 0;
    /** @member {Extent} */
    this.extent = new Extent();
  }

  /**
   * @param {BinaryStream} stream
   */
  readMdx(stream) {
    this.name = stream.read(80);
    stream.readUint32Array(this.interval);
    this.moveSpeed = stream.readFloat32();
    this.flags = stream.readUint32();
    this.rarity = stream.readFloat32();
    this.syncPoint = stream.readUint32();
    this.extent.readMdx(stream);
  }

  /**
   * @param {BinaryStream} stream
   */
  writeMdx(stream) {
    stream.write(this.name);
    stream.skip(80 - this.name.length);
    stream.writeUint32Array(this.interval);
    stream.writeFloat32(this.moveSpeed);
    stream.writeUint32(this.flags);
    stream.writeFloat32(this.rarity);
    stream.writeUint32(this.syncPoint);
    this.extent.writeMdx(stream);
  }

  /**
   * @param {TokenStream} stream
   */
  readMdl(stream) {
    this.name = stream.read();

    for (let token of stream.readBlock()) {
      if (token === 'Interval') {
        stream.readIntArray(this.interval);
      } else if (token === 'NonLooping') {
        this.flags = 1;
      } else if (token === 'MoveSpeed') {
        this.moveSpeed = stream.readFloat();
      } else if (token === 'Rarity') {
        this.rarity = stream.readFloat();
      } else if (token === 'MinimumExtent') {
        stream.readFloatArray(this.extent.min);
      } else if (token === 'MaximumExtent') {
        stream.readFloatArray(this.extent.max);
      } else if (token === 'BoundsRadius') {
        this.extent.boundsRadius = stream.readFloat();
      } else {
        throw new Error(`Unknown token in Sequence: "${token}"`);
      }
    }
  }

  /**
   * @param {TokenStream} stream
   */
  writeMdl(stream) {
    stream.startObjectBlock('Anim', this.name);
    stream.writeArrayAttrib('Interval', this.interval);

    if (this.flags === 1) {
      stream.writeFlag('NonLooping');
    }

    if (this.moveSpeed !== 0) {
      stream.writeFloatAttrib('MoveSpeed', this.moveSpeed);
    }

    if (this.rarity !== 0) {
      stream.writeFloatAttrib('Rarity', this.rarity);
    }

    this.extent.writeMdl(stream);
    stream.endBlock();
  }
}
