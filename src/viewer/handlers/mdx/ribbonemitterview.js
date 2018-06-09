/**
 * An MDX ribbon emitter view.
 */
export default class RibbonEmitterView {
  /**
   * @param {MdxInstance} instance
   * @param {MdxRibbonEmitter} emitter
   */
  constructor(instance, emitter) {
    this.instance = instance;
    this.emitter = emitter;
    this.currentEmission = 0;
    this.lastEmit = null;
    this.currentRibbon = -1;
    this.ribbonCount = 0;
  }

  /**
   *
   */
  update() {
    if (this.instance.allowParticleSpawn) {
      this.currentEmission += this.emitter.emissionRate * this.instance.model.viewer.frameTime * 0.001;
    }
  }

  /**
   * @param {Float32Array} out
   * @return {number}
   */
  getHeightBelow(out) {
    return this.emitter.getHeightBelow(out, this.instance);
  }

  /**
   * @param {Float32Array} out
   * @return {number}
   */
  getHeightAbove(out) {
    return this.emitter.getHeightAbove(out, this.instance);
  }

  /**
   * @param {Uint32Array} out
   * @return {number}
   */
  getTextureSlot(out) {
    return this.emitter.getTextureSlot(out, this.instance);
  }

  /**
   * @param {vec3} out
   * @return {number}
   */
  getColor(out) {
    return this.emitter.getColor(out, this.instance);
  }

  /**
   * @param {Float32Array} out
   * @return {number}
   */
  getAlpha(out) {
    return this.emitter.getAlpha(out, this.instance);
  }

  /**
   * @param {Float32Array} out
   * @return {number}
   */
  getVisibility(out) {
    return this.emitter.getVisibility(out, this.instance);
  }
}
