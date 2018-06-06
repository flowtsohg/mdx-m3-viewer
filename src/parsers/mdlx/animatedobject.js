import animationMap from './animationmap';

/**
 * The parent class for all objects that have animated data in them.
 */
export default class AnimatedObject {
  /**
   *
   */
  constructor() {
    /** @member {Array<Animation>} */
    this.animations = [];
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} size
   */
  readAnimations(stream, size) {
    while (size > 0) {
      let name = stream.read(4);
      let animation = new animationMap[name][1]();

      animation.readMdx(stream, name);

      size -= animation.getByteLength();

      this.animations.push(animation);
    }
  }

  /**
   * @param {BinaryStream} stream
   */
  writeAnimations(stream) {
    for (let animation of this.animations) {
      animation.writeMdx(stream);
    }
  }

  /**
   * A wrapper around readBlock() which merges static tokens.
   * E.g.: static Color
   * This makes the condition blocks in the parent objects linear and simple.
   *
   * @param {BinaryStream} stream
   */
  * readAnimatedBlock(stream) {
    for (let token of stream.readBlock()) {
      if (token === 'static') {
        yield `static ${stream.read()}`;
      } else {
        yield token;
      }
    }
  }

  /**
   * @param {TokenStream} stream
   * @param {string} name
   */
  readAnimation(stream, name) {
    let animation = new animationMap[name][1]();

    animation.readMdl(stream, name);

    this.animations.push(animation);
  }

  /**
   * @param {TokenStream} stream
   * @param {string} name
   * @return {boolean}
   */
  writeAnimation(stream, name) {
    for (let animation of this.animations) {
      if (animation.name === name) {
        animation.writeMdl(stream, animationMap[name][0]);
        return true;
      }
    }

    return false;
  }

  /**
   * @return {number}
   */
  getByteLength() {
    let size = 0;

    for (let animation of this.animations) {
      size += animation.getByteLength();
    }

    return size;
  }
}
