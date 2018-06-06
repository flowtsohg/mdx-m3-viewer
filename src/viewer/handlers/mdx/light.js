import {vec3} from 'gl-matrix';
import GenericObject from './genericobject';

// Heap allocations needed for this module.
let colorHeap = vec3.create();
let ambientColorHeap = vec3.create();

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
   * @param {ModelInstance} instance
   * @return {number}
   */
  getAttenuationStart(instance) {
    return this.getValue('KLAS', instance, this.attenuation[0]);
  }

  /**
   * @param {ModelInstance} instance
   * @return {number}
   */
  getAttenuationEnd(instance) {
    return this.getValue('KLAE', instance, this.attenuation[1]);
  }

  /**
   * @param {ModelInstance} instance
   * @return {number}
   */
  getIntensity(instance) {
    return this.getValue('KLAI', instance, this.intensity);
  }

  /**
   * @param {ModelInstance} instance
   * @return {vec3}
   */
  getColor(instance) {
    return this.getValue3(colorHeap, 'KLAC', instance, this.color);
  }

  /**
   * @param {ModelInstance} instance
   * @return {number}
   */
  getAmbientIntensity(instance) {
    return this.getValue('KLBI', instance, this.ambientIntensity);
  }

  /**
   * @param {ModelInstance} instance
   * @return {vec3}
   */
  getAmbientColor(instance) {
    return this.getValue3(ambientColorHeap, 'KLBC', instance, this.ambientColor);
  }
}
