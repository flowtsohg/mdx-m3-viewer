/**
 * An MDX particle emitter type 2 view.
 */
export default class ParticleEmitter2View {
  /**
   * @param {MdxModelInstance} instance
   * @param {MdxParticle2Emitter} emitter
   */
  constructor(instance, emitter) {
    this.instance = instance;
    this.emitter = emitter;
    this.currentEmission = 0;
    this.lastEmissionKey = -1;
  }

  /**
   *
   */
  update() {
    if (this.instance.allowParticleSpawn) {
      if (this.emitter.squirt) {
        let keyframe = this.getEmissionRateKeyframe();

        if (keyframe !== this.lastEmissionKey) {
          this.currentEmission += this.getEmissionRate();
        }

        this.lastEmissionKey = keyframe;
      } else {
        this.currentEmission += this.getEmissionRate() * this.instance.model.viewer.frameTime * 0.001;
      }
    }
  }

  /**
   * @return {number}
   */
  getWidth() {
    return this.emitter.getWidth(this.instance);
  }

  /**
   * @return {number}
   */
  getLength() {
    return this.emitter.getLength(this.instance);
  }

  /**
   * @return {number}
   */
  getSpeed() {
    return this.emitter.getSpeed(this.instance);
  }

  /**
   * @return {number}
   */
  getLatitude() {
    return this.emitter.getLatitude(this.instance);
  }

  /**
   * @return {number}
   */
  getGravity() {
    return this.emitter.getGravity(this.instance);
  }

  /**
   * @return {number}
   */
  getEmissionRate() {
    return this.emitter.getEmissionRate(this.instance);
  }

  /**
   * @return {number}
   */
  getEmissionRateKeyframe() {
    return this.emitter.getEmissionRateKeyframe(this.instance);
  }

  /**
   * @return {number}
   */
  getVisibility() {
    return this.emitter.getVisibility(this.instance);
  }

  /**
   * @return {number}
   */
  getVariation() {
    return this.emitter.getVariation(this.instance);
  }
}
