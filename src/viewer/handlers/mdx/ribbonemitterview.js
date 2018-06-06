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
   * @return {number}
   */
  getHeightBelow() {
    return this.emitter.getHeightBelow(this.instance);
  }

  /**
   * @return {number}
   */
  getHeightAbove() {
    return this.emitter.getHeightAbove(this.instance);
  }

  /**
   * @return {number}
   */
  getTextureSlot() {
    return this.emitter.getTextureSlot(this.instance);
  }

  /**
   * @return {vec3}
   */
  getColor() {
    return this.emitter.getColor(this.instance);
  }

  /**
   * @return {number}
   */
  getAlpha() {
    return this.emitter.getAlpha(this.instance);
  }

  /**
   * @return {number}
   */
  getVisibility() {
    return this.emitter.getVisibility(this.instance);
  }
}
