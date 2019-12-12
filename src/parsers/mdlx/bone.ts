import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import GenericObject from './genericobject';

/**
 * A bone.
 */
export default class Bone extends GenericObject {
  geosetId: number = -1;
  geosetAnimationId: number = -1;

  constructor() {
    super(0x100);
  }

  readMdx(stream: BinaryStream) {
    super.readMdx(stream);

    this.geosetId = stream.readInt32();
    this.geosetAnimationId = stream.readInt32();
  }

  writeMdx(stream: BinaryStream) {
    super.writeMdx(stream);

    stream.writeInt32(this.geosetId);
    stream.writeInt32(this.geosetAnimationId);
  }

  readMdl(stream: TokenStream) {
    for (let token of super.readGenericBlock(stream)) {
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

  writeMdl(stream: TokenStream) {
    stream.startObjectBlock('Bone', this.name);
    this.writeGenericHeader(stream);

    let geosetId: number | string = this.geosetId;
    let geosetAnimationId: number | string = this.geosetAnimationId;

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

  getByteLength() {
    return 8 + super.getByteLength();
  }
}
