import {VEC3_ZERO, VEC3_ONE, QUAT_DEFAULT} from '../../../common/gl-matrix-addon';
import AnimatedObject from './animatedobject';

/**
 * An MDX texture animation.
 */
export default class TextureAnimation extends AnimatedObject {
  /**
   * @param {vec3} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getTranslation(out, instance) {
    return this.getVector3Value(out, 'KTAT', instance, VEC3_ZERO);
  }

  /**
   * @param {quat} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getRotation(out, instance) {
    return this.getVector4Value(out, 'KTAR', instance, QUAT_DEFAULT);
  }

  /**
   * @param {vec3} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getScale(out, instance) {
    return this.getVector3Value(out, 'KTAS', instance, VEC3_ONE);
  }

  /**
   * @param {number} sequence
   * @return {boolean}
   */
  isTranslationVariant(sequence) {
    return this.isVariant('KTAT', sequence);
  }

  /**
   * @param {number} sequence
   * @return {boolean}
   */
  isRotationVariant(sequence) {
    return this.isVariant('KTAR', sequence);
  }

  /**
   * @param {number} sequence
   * @return {boolean}
   */
  isScaleVariant(sequence) {
    return this.isVariant('KTAS', sequence);
  }
}
