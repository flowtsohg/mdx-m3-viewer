import { VEC3_ZERO, VEC3_ONE, QUAT_DEFAULT } from '../../../common/gl-matrix-addon';
import MdlxTextureAnimation from '../../../parsers/mdlx/textureanimation';
import AnimatedObject from './animatedobject';
import MdxModel from './model';

/**
 * An MDX texture animation.
 */
export default class TextureAnimation extends AnimatedObject {
  constructor(model: MdxModel, textureAnimation: MdlxTextureAnimation) {
    super(model, textureAnimation);

    this.addVariants('KTAT', 'translation');
    this.addVariants('KTAR', 'rotation');
    this.addVariants('KTAS', 'scale');
  }

  getTranslation(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getVectorValue(out, 'KTAT', sequence, frame, counter, <Float32Array>VEC3_ZERO);
  }

  getRotation(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getQuatValue(out, 'KTAR', sequence, frame, counter, <Float32Array>QUAT_DEFAULT);
  }

  getScale(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getVectorValue(out, 'KTAS', sequence, frame, counter, <Float32Array>VEC3_ONE);
  }
}
