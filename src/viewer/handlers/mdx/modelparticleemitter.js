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
   * @param {ModelInstance} instance
   * @return {number}
   */
  getSpeed(instance) {
    return this.getValue('KPES', instance, this.speed);
  }

  /**
   * @param {ModelInstance} instance
   * @return {number}
   */
  getLatitude(instance) {
    return this.getValue('KPLTV', instance, this.latitude);
  }

  /**
   * @param {ModelInstance} instance
   * @return {number}
   */
  getLongitude(instance) {
    return this.getValue('KPLN', instance, this.longitude);
  }

  /**
   * @param {ModelInstance} instance
   * @return {number}
   */
  getLifeSpan(instance) {
    return this.getValue('KPEL', instance, this.lifeSpan);
  }

  /**
   * @param {ModelInstance} instance
   * @return {number}
   */
  getGravity(instance) {
    return this.getValue('KPEG', instance, this.gravity);
  }

  /**
   * @param {ModelInstance} instance
   * @return {number}
   */
  getEmissionRate(instance) {
    return this.getValue('KPEE', instance, this.emissionRate);
  }

  /**
   * @param {ModelInstance} instance
   * @return {number}
   */
  getVisibility(instance) {
    return this.getValue('KPEV', instance, 1);
  }
}
