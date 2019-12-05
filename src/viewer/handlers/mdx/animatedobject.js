import {vec3, quat} from 'gl-matrix';
import createTypedSd from './sd';

/**
 * An animation object.
 */
export default class AnimatedObject {
  /**
   * @param {Model} model
   * @param {mdlx.AnimatedObject} object
   */
  constructor(model, object) {
    /** @member {Model} */
    this.model = model;
    /** @member {Object<string, ScalarSd|VectorSd|QuatSd>} */
    this.animations = {};

    for (let animation of object.animations) {
      this.animations[animation.name] = createTypedSd(model, animation);
    }
  }

  /**
   * @param {Uint32Array|Float32Array} out
   * @param {string} name
   * @param {ModelInstance} instance
   * @param {number} defaultValue
   * @return {number}
   */
  getScalarValue(out, name, instance, defaultValue) {
    let animation = this.animations[name];

    if (animation) {
      return animation.getValue(out, instance);
    }

    out[0] = defaultValue;
    return -1;
  }

  /**
   * @param {vec3} out
   * @param {string} name
   * @param {ModelInstance} instance
   * @param {vec3} defaultValue
   * @return {number}
   */
  getVectorValue(out, name, instance, defaultValue) {
    let animation = this.animations[name];

    if (animation) {
      return animation.getValue(out, instance);
    }

    vec3.copy(out, defaultValue);
    return -1;
  }

  /**
   * @param {quat} out
   * @param {string} name
   * @param {ModelInstance} instance
   * @param {quat} defaultValue
   * @return {number}
   */
  getQuatValue(out, name, instance, defaultValue) {
    let animation = this.animations[name];

    if (animation) {
      return animation.getValue(out, instance);
    }

    quat.copy(out, defaultValue);
    return -1;
  }

  /**
   * @param {string} name
   * @param {number} sequence
   * @return {boolean}
   */
  isVariant(name, sequence) {
    let animation = this.animations[name];

    if (animation) {
      return animation.isVariant(sequence);
    }

    return false;
  }
}
