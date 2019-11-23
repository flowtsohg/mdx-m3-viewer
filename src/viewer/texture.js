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
}
