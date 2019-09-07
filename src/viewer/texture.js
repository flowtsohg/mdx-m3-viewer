import Resource from './resource';

/**
 * A texture.
 */
export default class Texture extends Resource {
  /**
   * @param {Object} resourceData
   */
  constructor(resourceData) {
    super(resourceData);

    /** @param {number} */
    this.width = 0;
    /** @param {number} */
    this.height = 0;
    /** @param {boolean} */
    this.wrapS = false;
    /** @param {boolean} */
    this.wrapT = false;
  }

  /**
   * @param {number} unit
   */
  bind(unit) {
    let viewer = this.viewer;
    let gl = this.viewer.gl;

    viewer.webgl.bindTexture(this, unit);

    if (this.wrapS) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    }

    if (this.wrapT) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
  }
}
