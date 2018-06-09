import GenericObject from './genericobject';

/**
 * An MDX particle emitter.
 */
export default class ParticleEmitter extends GenericObject {
  /**
   * @param {MdxModel} model
   * @param {MdxParserParticleEmitter} emitter
   * @param {number} index
   */
  constructor(model, emitter, index) {
    super(model, emitter, index);

    this.internalResource = model.viewer.load(emitter.path.replace(/\\/g, '/').toLowerCase().replace('.mdl', '.mdx'), model.pathSolver);
    this.speed = emitter.speed;
    this.latitude = emitter.latitude;
    this.longitude = emitter.longitude;
    this.lifeSpan = emitter.lifeSpan;
    this.gravity = emitter.gravity;
    this.emissionRate = emitter.emissionRate;
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getSpeed(out, instance) {
    return this.getFloatValue(out, 'KPES', instance, this.speed);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getLatitude(out, instance) {
    return this.getFloatValue(out, 'KPLTV', instance, this.latitude);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getLongitude(out, instance) {
    return this.getFloatValue(out, 'KPLN', instance, this.longitude);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getLifeSpan(out, instance) {
    return this.getFloatValue(out, 'KPEL', instance, this.lifeSpan);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getGravity(out, instance) {
    return this.getFloatValue(out, 'KPEG', instance, this.gravity);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getEmissionRate(out, instance) {
    return this.getFloatValue(out, 'KPEE', instance, this.emissionRate);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getVisibility(out, instance) {
    return this.getFloatValue(out, 'KPEV', instance, 1);
  }
}
