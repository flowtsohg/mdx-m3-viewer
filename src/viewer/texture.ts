import { isPowerOfTwo } from '../common/math';
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

  /**
   * Update this texture with `src`, overriding whatever texture data it contains.
   */
  update(src: TexImageSource) {
    let gl = this.viewer.gl;
    let width = src.width;
    let height = src.height;

    gl.bindTexture(gl.TEXTURE_2D, this.webglResource);

    if (width === this.width && height === this.height) {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, src);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);

      this.width = width;
      this.height = height;
    }

    if (isPowerOfTwo(width) && isPowerOfTwo(height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    }
  }
}
