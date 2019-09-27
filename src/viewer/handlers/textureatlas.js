import Texture from '../texture';

/**
 * A texture handler for texture atlases.
 */
export default class TextureAtlas extends Texture {
  /**
   * @param {ImageData} src
   * @param {?Object} options
   */
  load(src, options) {
    let viewer = this.viewer;
    let gl = viewer.gl;

    let id = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, id);

    let magFilter = gl.LINEAR;
    let minFilter = gl.LINEAR;

    if (options && options.nearestFiltering) {
      magFilter = gl.NEAREST;
      minFilter = gl.NEAREST;
    }

    viewer.webgl.setTextureMode(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, magFilter, minFilter);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src.imageData);

    this.width = src.imageData.width;
    this.height = src.imageData.height;
    this.columns = src.columns;
    this.rows = src.rows;
    this.webglResource = id;
  }
}
