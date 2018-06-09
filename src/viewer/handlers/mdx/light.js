import GenericObject from './genericobject';

/**
 * An MDX light.
 */
export default class Light extends GenericObject {
  /**
   * @param {Model} model
   * @param {Light} light
   * @param {number} index
   */
  constructor(model, light, index) {
    super(model, light, index);

    this.type = light.type;
    this.attenuation = light.attenuation;
    this.color = light.color;
    this.intensity = light.intensity;
    this.ambientColor = light.ambientColor;
    this.ambientIntensity = light.ambientIntensity;
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getAttenuationStart(out, instance) {
    return this.getFloatValue(out, 'KLAS', instance, this.attenuation[0]);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getAttenuationEnd(out, instance) {
    return this.getFloatValue(out, 'KLAE', instance, this.attenuation[1]);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getIntensity(out, instance) {
    return this.getFloatValue(out, 'KLAI', instance, this.intensity);
  }

  /**
   * @param {vec3} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getColor(out, instance) {
    return this.getVector3Value(out, 'KLAC', instance, this.color);
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getAmbientIntensity(out, instance) {
    return this.getFloatValue(out, 'KLBI', instance, this.ambientIntensity);
  }

  /**
   * @param {vec3} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getAmbientColor(out, instance) {
    return this.getVector3Value(out, 'KLBC', instance, this.ambientColor);
  }
}
