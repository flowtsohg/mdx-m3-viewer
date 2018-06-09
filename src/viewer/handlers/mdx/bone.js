import GenericObject from './genericobject';

/**
 * An MDX bone.
 */
export default class Bone extends GenericObject {
  /**
   * @param {ModelViewer.viewer.Model} model
   * @param {ModelViewer.parsers.mdx.Bone} bone
   * @param {number} index
   */
  constructor(model, bone, index) {
    super(model, bone, index);

    this.geosetAnimation = model.geosetAnimations[bone.geosetAnimationId];
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getVisibility(out, instance) {
    if (this.geosetAnimation) {
      return this.geosetAnimation.getAlpha(out, instance);
    }

    out[0] = 1;
    return -1;
  }
}
