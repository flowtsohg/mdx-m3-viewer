import Texture from '../../texture';

/**
 * An M3 texture.
 */
export default class M3Texture {
  texture: Texture | null = null;
  wrapS: number = 0x812f; // CLAMP_TO_EDGE
  wrapT: number = 0x812f;

  constructor(repeatS: boolean, repeatT: boolean) {
    if (repeatS) {
      this.wrapS = 0x2901; // REPEAT
    }

    if (repeatT) {
      this.wrapT = 0x2901;
    }
  }
}
