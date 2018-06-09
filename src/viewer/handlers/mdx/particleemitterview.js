// Heap allocations needed for this module.
let emissionRateHeap = new Float32Array(1);

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
      this.getEmissionRate(emissionRateHeap);

      this.currentEmission += emissionRateHeap[0] * this.instance.model.viewer.frameTime * 0.001;
    }
  }

  /**
   * @param {Float32Array} out
   * @return {number}
   */
  getSpeed(out) {
    return this.emitter.getSpeed(out, this.instance);
  }

  /**
   * @param {Float32Array} out
   * @return {number}
   */
  getLatitude(out) {
    return this.emitter.getLatitude(out, this.instance);
  }

  /**
   * @param {Float32Array} out
   * @return {number}
   */
  getLongitude(out) {
    return this.emitter.getLongitude(out, this.instance);
  }

  /**
   * @param {Float32Array} out
   * @return {number}
   */
  getLifeSpan(out) {
    return this.emitter.getLifeSpan(out, this.instance);
  }

  /**
   * @param {Float32Array} out
   * @return {number}
   */
  getGravity(out) {
    return this.emitter.getGravity(out, this.instance);
  }

  /**
   * @param {Float32Array} out
   * @return {number}
   */
  getEmissionRate(out) {
    return this.emitter.getEmissionRate(out, this.instance);
  }

  /**
   * @param {Float32Array} out
   * @return {number}
   */
  getVisibility(out) {
    return this.emitter.getVisibility(out, this.instance);
  }
}
