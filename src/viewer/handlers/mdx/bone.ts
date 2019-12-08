import MdlxBone from '../../../parsers/mdlx/bone';
import MdxModel from './model';
import MdxComplexInstance from './complexinstance';
import GenericObject from './genericobject';
import GeosetAnimation from './geosetanimation';

/**
 * An MDX bone.
 */
export default class Bone extends GenericObject {
  geosetAnimation: GeosetAnimation;

  constructor(model: MdxModel, bone: MdlxBone, index: number) {
    super(model, bone, index);

    this.geosetAnimation = model.geosetAnimations[bone.geosetAnimationId];
  }

  getVisibility(out: Float32Array, instance: MdxComplexInstance) {
    if (this.geosetAnimation) {
      return this.geosetAnimation.getAlpha(out, instance);
    }

    out[0] = 1;

    return -1;
  }
}
