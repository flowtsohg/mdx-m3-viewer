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
  }

  /**
   * @param {number} unit
   */
  bind(unit) {
    this.viewer.webgl.bindTexture(this, unit);
  }

  /**
   * @param {number} s
   * @param {number} t
   */
  wrapMode(s, t) {
    let viewer = this.viewer;
    let gl = viewer.gl;

    viewer.webgl.bindTexture(this, 0);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, s);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, t);
  }

  /**
   * @param {number} mag
   * @param {number} min
   */
  filterMode(mag, min) {
    let viewer = this.viewer;
    let gl = viewer.gl;

    viewer.webgl.bindTexture(this, 0);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mag);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, min);
  }
}
