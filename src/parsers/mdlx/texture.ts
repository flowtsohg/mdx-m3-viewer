import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';

export const enum WrapMode {
  RepeatBoth = 0,
  WrapWidth = 1,
  WrapHeight = 2,
  WrapBoth = 3,
}

/**
 * A texture.
 */
export default class Texture {
  replaceableId = 0;
  path = '';
  wrapMode = WrapMode.RepeatBoth;

  readMdx(stream: BinaryStream): void {
    this.replaceableId = stream.readUint32();
    this.path = stream.read(260);
    this.wrapMode = stream.readUint32();
  }

  writeMdx(stream: BinaryStream): void {
    stream.writeUint32(this.replaceableId);
    stream.skip(260 - stream.write(this.path));
    stream.writeUint32(this.wrapMode);
  }

  readMdl(stream: TokenStream): void {
    for (const token of stream.readBlock()) {
      if (token === 'Image') {
        this.path = stream.read();
      } else if (token === 'ReplaceableId') {
        this.replaceableId = stream.readInt();
      } else if (token === 'WrapWidth') {
        this.wrapMode |= WrapMode.WrapWidth;
      } else if (token === 'WrapHeight') {
        this.wrapMode |= WrapMode.WrapHeight;
      } else {
        throw new Error(`Unknown token in Texture: "${token}"`);
      }
    }
  }

  writeMdl(stream: TokenStream): void {
    stream.startBlock('Bitmap');

    if (this.path.length) {
      stream.writeStringAttrib('Image', this.path);
    }

    if (this.replaceableId !== 0) {
      stream.writeNumberAttrib('ReplaceableId', this.replaceableId);
    }

    if (this.wrapMode & WrapMode.WrapWidth) {
      stream.writeFlag(`WrapWidth`);
    }

    if (this.wrapMode & WrapMode.WrapHeight) {
      stream.writeFlag(`WrapHeight`);
    }

    stream.endBlock();
  }
}
