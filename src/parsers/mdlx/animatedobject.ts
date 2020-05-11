import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import { Animation } from './animations';
import animationMap from './animationmap';

/**
 * The parent class for all objects that have animated data in them.
 */
export default class AnimatedObject {
  animations: Animation[] = [];

  readAnimations(stream: BinaryStream, size: number) {
    let end = stream.index + size;

    while (stream.index < end) {
      let name = stream.read(4);
      let animation = new animationMap[name][1]();

      animation.readMdx(stream, name);

      this.animations.push(animation);
    }
  }

  writeAnimations(stream: BinaryStream) {
    for (let animation of this.animations) {
      animation.writeMdx(stream);
    }
  }

  /**
   * A wrapper around readBlock() which merges static tokens.
   * E.g.: static Color
   * This makes the condition blocks in the parent objects linear and simple.
   */
  * readAnimatedBlock(stream: TokenStream) {
    for (let token of stream.readBlock()) {
      if (token === 'static') {
        yield `static ${stream.read()}`;
      } else {
        yield token;
      }
    }
  }

  readAnimation(stream: TokenStream, name: string) {
    let animation = new animationMap[name][1]();

    animation.readMdl(stream, name);

    this.animations.push(animation);
  }

  writeAnimation(stream: TokenStream, name: string) {
    for (let animation of this.animations) {
      if (animation.name === name) {
        animation.writeMdl(stream, animationMap[name][0]);
        return true;
      }
    }

    return false;
  }

  /**
   * AnimatedObject itself doesn't care about versions, however objects that inherit it do.
   */
  getByteLength(version?: number) {
    let size = 0;

    for (let animation of this.animations) {
      size += animation.getByteLength();
    }

    return size;
  }
}
