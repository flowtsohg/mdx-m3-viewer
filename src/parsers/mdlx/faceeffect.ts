import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';

/**
 * A face effect.
 */
export default class FaceEffect {
  type: string = '';
  path: string = '';

  readMdx(stream: BinaryStream) {
    this.type = stream.read(80);
    this.path = stream.read(260);
  }

  writeMdx(stream: BinaryStream) {
    stream.write(this.type);
    stream.skip(80 - this.type.length);
    stream.write(this.path);
    stream.skip(260 - this.path.length);
  }

  readMdl(stream: TokenStream) {
    this.type = stream.read();

    for (let token of stream.readBlock()) {
      if (token === 'Path') {
        this.path = stream.read();
      } else {
        throw new Error(`Unknown token in FaceEffect: "${token}"`);
      }
    }
  }

  writeMdl(stream: TokenStream) {
    stream.startObjectBlock('FaceFX', this.type);
    stream.writeStringAttrib('Path', this.path);
    stream.endBlock();
  }
}
