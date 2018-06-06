import AnimatedObject from './animatedobject';

/**
 * A texture animation.
 */
export default class TextureAnimation extends AnimatedObject {
  /**
   * @param {BinaryStream} stream
   */
  readMdx(stream) {
    let size = stream.readUint32();

    this.readAnimations(stream, size - 4);
  }

  /**
   * @param {BinaryStream} stream
   */
  writeMdx(stream) {
    stream.writeUint32(this.getByteLength());
    this.writeAnimations(stream);
  }

  /**
   * @param {TokenStream} stream
   */
  readMdl(stream) {
    for (let token of stream.readBlock()) {
      if (token === 'Translation') {
        this.readAnimation(stream, 'KTAT');
      } else if (token === 'Rotation') {
        this.readAnimation(stream, 'KTAR');
      } else if (token === 'Scaling') {
        this.readAnimation(stream, 'KTAS');
      } else {
        throw new Error(`Unknown token in TextureAnimation: "${token}"`);
      }
    }
  }

  /**
   * @param {TokenStream} stream
   */
  writeMdl(stream) {
    stream.startBlock('TVertexAnim ');
    this.writeAnimation(stream, 'KTAT');
    this.writeAnimation(stream, 'KTAR');
    this.writeAnimation(stream, 'KTAS');
    stream.endBlock();
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 4 + super.getByteLength();
  }
}
