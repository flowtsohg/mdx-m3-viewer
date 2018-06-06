import {vec3, quat} from 'gl-matrix';
import {VEC3_ZERO, VEC3_ONE, QUAT_DEFAULT} from '../../../common/gl-matrix-addon';
import AnimatedObject from './animatedobject';

// Heap allocations needed for this module.
let translationHeap = vec3.create();
let rotationHeap = quat.create();
let scaleHeap = vec3.create();

/**
 * An MDX texture animation.
 */
export default class TextureAnimation extends AnimatedObject {
  /**
   * @param {ModelInstance} instance
   * @return {vec3}
   */
  getTranslation(instance) {
    return this.getValue3(translationHeap, 'KTAT', instance, VEC3_ZERO);
  }

  /**
   * @param {ModelInstance} instance
   * @return {quat}
   */
  getRotation(instance) {
    return this.getValue4(rotationHeap, 'KTAR', instance, QUAT_DEFAULT);
  }

  /**
   * @param {ModelInstance} instance
   * @return {vec3}
   */
  getScale(instance) {
    return this.getValue3(scaleHeap, 'KTAS', instance, VEC3_ONE);
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
