import { WrapMode } from '../../../parsers/mdlx/texture';
import Texture from '../../texture';

/**
 * An MDX texture.
 */
export default class MdxTexture {
  texture: Texture | null = null;
  replaceableId: number;
  wrapS = 0x812f; // CLAMP_TO_EDGE
  wrapT = 0x812f;

  constructor(replaceableId: number, wrapMode: WrapMode) {
    this.replaceableId = replaceableId;

    if (wrapMode & WrapMode.WrapWidth) {
      this.wrapS = 0x2901; // REPEAT
    }

    if (wrapMode & WrapMode.WrapHeight) {
      this.wrapT = 0x2901;
    }
  }
}
