import AnimatedObject from './animatedobject';

/**
 * A geoset animation.
 */
export default class GeosetAnimation extends AnimatedObject {
  /**
   *
   */
  constructor() {
    super();

    /** @member {number} */
    this.alpha = 1;
    /** @member {number} */
    this.flags = 0;
    /** @member {Float32Array} */
    this.color = new Float32Array([1, 1, 1]);
    /** @member {number} */
    this.geosetId = -1;
    /** @member {Array<Animation>} */
    this.animations = [];
  }

  /**
   * @param {BinaryStream} stream
   */
  readMdx(stream) {
    let size = stream.readUint32();

    this.alpha = stream.readFloat32();
    this.flags = stream.readUint32();
    stream.readFloat32Array(this.color);
    this.geosetId = stream.readInt32();

    this.readAnimations(stream, size - 28);
  }

  /**
   * @param {BinaryStream} stream
   */
  writeMdx(stream) {
    stream.writeUint32(this.getByteLength());
    stream.writeFloat32(this.alpha);
    stream.writeUint32(this.flags);
    stream.writeFloat32Array(this.color);
    stream.writeInt32(this.geosetId);

    this.writeAnimations(stream);
  }

  /**
   * @param {TokenStream} stream
   */
  readMdl(stream) {
    for (let token of this.readAnimatedBlock(stream)) {
      if (token === 'DropShadow') {
        this.flags |= 0x1;
      } else if (token === 'static Alpha') {
        this.alpha = stream.readFloat();
      } else if (token === 'Alpha') {
        this.readAnimation(stream, 'KGAO');
      } else if (token === 'static Color') {
        this.flags |= 0x2;
        stream.readColor(this.color);
      } else if (token === 'Color') {
        this.flags |= 0x2;
        this.readAnimation(stream, 'KGAC');
      } else if (token === 'GeosetId') {
        this.geosetId = stream.readInt();
      } else {
        throw new Error(`Unknown token in GeosetAnimation: "${token}"`);
      }
    }
  }

  /**
   * @param {TokenStream} stream
   */
  writeMdl(stream) {
    stream.startBlock('GeosetAnim');

    if (this.flags & 0x1) {
      stream.writeFlag('DropShadow');
    }

    if (!this.writeAnimation(stream, 'KGAO')) {
      stream.writeFloatAttrib('static Alpha', this.alpha);
    }

    if (this.flags & 0x2) {
      if (!this.writeAnimation(stream, 'KGAC') && (this.color[0] !== 1 || this.color[1] !== 1 || this.color[2] !== 1)) {
        stream.writeColor('static Color ', this.color);
      }
    }

    stream.writeAttrib('GeosetId', this.geosetId);

    stream.endBlock();
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 28 + super.getByteLength();
  }
}
