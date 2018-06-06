import GenericObject from './genericobject';

/**
 * A bone.
 */
export default class Bone extends GenericObject {
  /**
   *
   */
  constructor() {
    super(0x100);

    /** @member {number} */
    this.geosetId = -1;
    /** @member {number} */
    this.geosetAnimationId = -1;
  }

  /**
   * @param {BinaryStream} stream
   */
  readMdx(stream) {
    super.readMdx(stream);

    this.geosetId = stream.readInt32();
    this.geosetAnimationId = stream.readInt32();
  }

  /**
   * @param {BinaryStream} stream
   */
  writeMdx(stream) {
    super.writeMdx(stream);

    stream.writeInt32(this.geosetId);
    stream.writeInt32(this.geosetAnimationId);
  }

  /**
   * @param {TokenStream} stream
   */
  readMdl(stream) {
    for (let token of super.readMdl(stream)) {
      if (token === 'GeosetId') {
        token = stream.read();

        if (token === 'Multiple') {
          this.geosetId = -1;
        } else {
          this.geosetId = parseInt(token);
        }
      } else if (token === 'GeosetAnimId') {
        token = stream.read();

        if (token === 'None') {
          this.geosetAnimationId = -1;
        } else {
          this.geosetAnimationId = parseInt(token);
        }
      } else {
        throw new Error(`Unknown token in Bone ${this.name}: "${token}"`);
      }
    }
  }

  /**
   * @param {TokenStream} stream
   */
  writeMdl(stream) {
    stream.startObjectBlock('Bone', this.name);
    this.writeGenericHeader(stream);

    let geosetId = this.geosetId;
    let geosetAnimationId = this.geosetAnimationId;

    if (geosetId === -1) {
      geosetId = 'Multiple';
    }

    if (geosetAnimationId === -1) {
      geosetAnimationId = 'None';
    }

    stream.writeAttrib('GeosetId', geosetId);
    stream.writeAttrib('GeosetAnimId', geosetAnimationId);

    this.writeGenericAnimations(stream);
    stream.endBlock();
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 8 + super.getByteLength();
  }
}
