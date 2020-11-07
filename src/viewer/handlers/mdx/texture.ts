import Texture from '../../texture';

/**
 * An MDX texture.
 */
export default class MdxTexture {
  texture: Texture | null = null;
  replaceableId: number = 0;
  wrapS: boolean = false;
  wrapT: boolean = false;

  constructor(replaceableId: number, wrapS: boolean, wrapT: boolean) {
    this.replaceableId = replaceableId;
    this.wrapS = wrapS;
    this.wrapT = wrapT;
  }
}
