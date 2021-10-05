import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';

/**
 * A face effect.
 */
export default class FaceEffect {
  type = '';
  path = '';

  readMdx(stream: BinaryStream): void {
    this.type = stream.read(80);
    this.path = stream.read(260);
  }

  writeMdx(stream: BinaryStream): void {
    stream.skip(80 - stream.write(this.type));
    stream.skip(260 - stream.write(this.path));
  }

  readMdl(stream: TokenStream): void {
    this.type = stream.read();

    for (const token of stream.readBlock()) {
      if (token === 'Path') {
        this.path = stream.read();
      } else {
        throw new Error(`Unknown token in FaceEffect: "${token}"`);
      }
    }
  }

  writeMdl(stream: TokenStream): void {
    stream.startObjectBlock('FaceFX', this.type);
    stream.writeStringAttrib('Path', this.path);
    stream.endBlock();
  }
}
