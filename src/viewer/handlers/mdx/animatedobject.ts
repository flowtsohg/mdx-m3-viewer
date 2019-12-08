import { vec3, quat } from 'gl-matrix';
import MdlxAnimatedObject from '../../../parsers/mdlx/animatedobject';
import MdxModel from './model';
import MdxComplexInstance from './complexinstance';
import { Sd, createTypedSd } from './sd';

/**
 * An animation object.
 */
export default class AnimatedObject {
  model: MdxModel;
  animations: Map<string, Sd>;

  constructor(model: MdxModel, object: MdlxAnimatedObject) {
    this.model = model;
    this.animations = new Map();

    for (let animation of object.animations) {
      this.animations.set(animation.name, createTypedSd(model, animation));
    }
  }

  getScalarValue(out: Uint32Array | Float32Array, name: string, instance: MdxComplexInstance, defaultValue: number) {
    let animation = this.animations.get(name);

    if (animation) {
      return animation.getValue(out, instance);
    }

    out[0] = defaultValue;

    return -1;
  }

  getVectorValue(out: Float32Array, name: string, instance: MdxComplexInstance, defaultValue: Float32Array) {
    let animation = this.animations.get(name);

    if (animation) {
      return animation.getValue(out, instance);
    }

    out[0] = defaultValue[0];
    out[1] = defaultValue[1];
    out[2] = defaultValue[2];

    return -1;
  }

  getQuatValue(out: Float32Array, name: string, instance: MdxComplexInstance, defaultValue: Float32Array) {
    let animation = this.animations.get(name);

    if (animation) {
      return animation.getValue(out, instance);
    }

    out[0] = defaultValue[0];
    out[1] = defaultValue[1];
    out[2] = defaultValue[2];
    out[3] = defaultValue[3];

    return -1;
  }

  isVariant(name: string, sequence: number) {
    let animation = this.animations.get(name);

    if (animation) {
      return animation.isVariant(sequence);
    }

    return false;
  }
}
