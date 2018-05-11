import GenericObject from './genericobject';

export default class Bone extends GenericObject {
    /**
     * @param {ModelViewer.viewer.Model} model
     * @param {ModelViewer.parsers.mdx.Bone} bone
     */
    constructor(model, bone, pivotPoints, index) {
        super(model, bone, pivotPoints, index);

        this.geosetAnimation = model.geosetAnimations[bone.geosetAnimationId];
    }

    getVisibility(instance) {
        if (this.geosetAnimation) {
            return this.geosetAnimation.getAlpha(instance);
        }

        return 1;
    }
};
