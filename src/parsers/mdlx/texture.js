/**
 * A texture.
 */
export default class Texture {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.replaceableId = 0;
    /** @member {string} */
    this.path = '';
    /** @member {number} */
    this.flags = 0;
  }

  /**
   * @param {BinaryStream} stream
   */
  readMdx(stream) {
    this.replaceableId = stream.readUint32();
    this.path = stream.read(260);
    this.flags = stream.readUint32();
  }

  /**
   * @param {BinaryStream} stream
   */
  writeMdx(stream) {
    stream.writeUint32(this.replaceableId);
    stream.write(this.path);
    stream.skip(260 - this.path.length);
    stream.writeUint32(this.flags);
  }

  /**
   * @param {TokenStream} stream
   */
  readMdl(stream) {
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

  /**
   * @param {TokenStream} stream
   */
  writeMdl(stream) {
    stream.startBlock('Bitmap');
    stream.writeStringAttrib('Image', this.path);

    if (this.replaceableId !== 0) {
      stream.writeAttrib('ReplaceableId', this.replaceableId);
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
