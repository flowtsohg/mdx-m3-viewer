import { HandlerResource } from './handlerresource';

/**
 * A texture.
 */
export default abstract class Texture extends HandlerResource {
  webglResource: WebGLTexture | null = null;
  width: number = 0;
  height: number = 0;
  wrapS: number = 33071; // CLAMP_TO_EDGE
  wrapT: number = 33071;
  magFilter: number = 9729; // LINEAR
  minFilter: number = 9729;

  /**
   * Automatically apply the wrap and filter modes.
   */
  lateLoad() {
    this.viewer.webgl.setTextureMode(this.wrapS, this.wrapT, this.magFilter, this.minFilter);
  }

  /**
   * Bind this texture to the given texture unit.
   */
  bind(unit: number) {
    this.viewer.webgl.bindTexture(this, unit);
  }
}
