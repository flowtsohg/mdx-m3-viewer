// Heap allocations needed for this module.
let emissionRateHeap = new Float32Array(1);

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
      let keyframe = this.getEmissionRate(emissionRateHeap);

      if (this.emitter.squirt) {
        if (keyframe !== this.lastEmissionKey) {
          this.currentEmission += emissionRateHeap[0];
        }

        this.lastEmissionKey = keyframe;
      } else {
        this.currentEmission += emissionRateHeap[0] * this.instance.model.viewer.frameTime * 0.001;
      }
    }
  }

  /**
   * @param {Float32Array} out
   * @return {number}
   */
  getWidth(out) {
    return this.emitter.getWidth(out, this.instance);
  }

  /**
   * @param {Float32Array} out
   * @return {number}
   */
  getLength(out) {
    return this.emitter.getLength(out, this.instance);
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

  /**
   * @param {Float32Array} out
   * @return {number}
   */
  getVariation(out) {
    return this.emitter.getVariation(out, this.instance);
  }
}
