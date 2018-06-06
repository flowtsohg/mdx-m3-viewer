/**
 * An MDX particle emitter view.
 */
export default class ParticleEmitterView {
  /**
   * @param {MdxModelInstance} instance
   * @param {MdxParticleEmitter} emitter
   */
  constructor(instance, emitter) {
    this.instance = instance;
    this.emitter = emitter;
    this.currentEmission = 0;
  }

  /**
   *
   */
  update() {
    if (this.instance.allowParticleSpawn) {
      this.currentEmission += this.getEmissionRate() * this.instance.model.viewer.frameTime * 0.001;
    }
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
  getLongitude() {
    return this.emitter.getLongitude(this.instance);
  }

  /**
   * @return {number}
   */
  getLifeSpan() {
    return this.emitter.getLifeSpan(this.instance);
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
  getVisibility() {
    return this.emitter.getVisibility(this.instance);
  }
}
