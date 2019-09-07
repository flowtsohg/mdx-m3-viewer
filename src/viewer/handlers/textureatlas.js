import Texture from '../texture';

/**
 * A texture handler for texture atlases.
 */
export default class TextureAtlas extends Texture {
  /**
   * @param {ImageData} src
   */
  load(src) {
    let gl = this.viewer.gl;

    let id = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, id);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src.imageData);

    this.width = src.imageData.width;
    this.height = src.imageData.height;
    this.columns = src.columns;
    this.rows = src.rows;
    this.webglResource = id;
    this.wrapS = false;
    this.wrapT = false;
  }
}
