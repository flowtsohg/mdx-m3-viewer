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

    const gl = this.viewer.gl;

    /** @param {?WebGLTexture} */
    this.webglResource = null;
    /** @param {number} */
    this.width = 0;
    /** @param {number} */
    this.height = 0;
    /** @param {number} */
    this.wrapS = gl.CLAMP_TO_EDGE;
    /** @param {number} */
    this.wrapT = gl.CLAMP_TO_EDGE;
  }

  /**
   * @param {number} unit
   */
  bind(unit) {
    this.viewer.webgl.bindTexture(this, unit);
  }
}
