import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';

/**
 * An extent.
 */
export default class Extent {
  boundsRadius = 0;
  min = new Float32Array(3);
  max = new Float32Array(3);

  readMdx(stream: BinaryStream): void {
    this.boundsRadius = stream.readFloat32();
    stream.readFloat32Array(this.min);
    stream.readFloat32Array(this.max);
  }

  writeMdx(stream: BinaryStream): void {
    stream.writeFloat32(this.boundsRadius);
    stream.writeFloat32Array(this.min);
    stream.writeFloat32Array(this.max);
  }

  writeMdl(stream: TokenStream): void {
    if (this.min[0] !== 0 || this.min[1] !== 0 || this.min[2] !== 0) {
      stream.writeVectorAttrib('MinimumExtent', this.min);
    }

    if (this.max[0] !== 0 || this.max[1] !== 0 || this.max[2] !== 0) {
      stream.writeVectorAttrib('MaximumExtent', this.max);
    }

    if (this.boundsRadius !== 0) {
      stream.writeNumberAttrib('BoundsRadius', this.boundsRadius);
    }
  }
}
