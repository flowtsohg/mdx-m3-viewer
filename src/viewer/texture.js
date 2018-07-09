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
   * Set the WebGL wrap and filter values.
   *
   * @param {number} wrapS Wrap on the S axis.
   * @param {number} wrapT Wrap on the T axis.
   * @param {number} magFilter Maginfying filter.
   * @param {number} minFilter Minifying filter.
   */
  setParameters(wrapS, wrapT, magFilter, minFilter) {
    const gl = this.viewer.gl;

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
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
