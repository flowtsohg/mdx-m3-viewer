import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';

/**
 * A texture.
 */
export default class Texture {
  replaceableId: number = 0;
  path: string = '';
  flags: number = 0;

  readMdx(stream: BinaryStream) {
    this.replaceableId = stream.readUint32();
    this.path = stream.read(260);
    this.flags = stream.readUint32();
  }

  writeMdx(stream: BinaryStream) {
    stream.writeUint32(this.replaceableId);
    stream.write(this.path);
    stream.skip(260 - this.path.length);
    stream.writeUint32(this.flags);
  }

  readMdl(stream: TokenStream) {
    for (let token of stream.readBlock()) {
      if (token === 'Image') {
        this.path = stream.read();
      } else if (token === 'ReplaceableId') {
        this.replaceableId = stream.readInt();
      } else if (token === 'WrapWidth') {
        this.flags |= 0x1;
      } else if (token === 'WrapHeight') {
        this.flags |= 0x2;
      } else {
        throw new Error(`Unknown token in Texture: "${token}"`);
      }
    }
  }

  writeMdl(stream: TokenStream) {
    stream.startBlock('Bitmap');

    if (this.path.length) {
      stream.writeStringAttrib('Image', this.path);
    }

    if (this.replaceableId !== 0) {
      stream.writeNumberAttrib('ReplaceableId', this.replaceableId);
    }

    if (this.flags & 0x1) {
      stream.writeFlag(`WrapWidth`);
    }

    if (this.flags & 0x2) {
      stream.writeFlag(`WrapHeight`);
    }

    stream.endBlock();
  }
}
