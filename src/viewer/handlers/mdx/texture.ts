import Texture from '../../texture';

/**
 * An MDX texture.
 */
export default class MdxTexture {
  texture: Texture | null = null;
  replaceableId: number;
  wrapS: number = 0x812f; // CLAMP_TO_EDGE
  wrapT: number = 0x812f;

  constructor(replaceableId: number, repeatS: boolean, repeatT: boolean) {
    this.replaceableId = replaceableId;

    if (repeatS) {
      this.wrapS = 0x2901; // REPEAT
    }

    if (repeatT) {
      this.wrapT = 0x2901;
    }
  }
}
