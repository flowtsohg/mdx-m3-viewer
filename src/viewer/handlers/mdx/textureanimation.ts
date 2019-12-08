import { VEC3_ZERO, VEC3_ONE, QUAT_DEFAULT } from '../../../common/gl-matrix-addon';
import AnimatedObject from './animatedobject';
import MdxComplexInstance from './complexinstance';

/**
 * An MDX texture animation.
 */
export default class TextureAnimation extends AnimatedObject {
  getTranslation(out: Float32Array, instance: MdxComplexInstance) {
    return this.getVectorValue(out, 'KTAT', instance, VEC3_ZERO);
  }

  getRotation(out: Float32Array, instance: MdxComplexInstance) {
    return this.getQuatValue(out, 'KTAR', instance, QUAT_DEFAULT);
  }

  getScale(out: Float32Array, instance: MdxComplexInstance) {
    return this.getVectorValue(out, 'KTAS', instance, VEC3_ONE);
  }

  isTranslationVariant(sequence: number) {
    return this.isVariant('KTAT', sequence);
  }

  isRotationVariant(sequence: number) {
    return this.isVariant('KTAR', sequence);
  }

  isScaleVariant(sequence: number) {
    return this.isVariant('KTAS', sequence);
  }
}
