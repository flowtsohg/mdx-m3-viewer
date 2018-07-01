/**
 * war3map.shd - the shadow file.
 */
export default class War3MapShd {
  /**
   * @param {?ArrayBuffer} buffer
   * @param {?number} width
   * @param {?number} height
   */
  constructor(buffer, width, height) {
    /** @member {Uint8Array} */
    this.shadows = new Uint8Array(0);

    if (buffer) {
      this.load(buffer, width, height);
    }
  }

  /**
   * @param {ArrayBuffer} buffer
   * @param {number} width
   * @param {number} height
   */
  load(buffer, width, height) {
    this.shadows = new Uint8Array(buffer.slice(0, width * height * 16));
  }

  /**
   * @return {ArrayBuffer}
   */
  save() {
    return this.shadows.slice().buffer;
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return this.shadows.length;
  }
}
