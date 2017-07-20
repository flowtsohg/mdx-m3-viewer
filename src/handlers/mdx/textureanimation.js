import { vec3, quat } from "gl-matrix";
import MdxSdContainer from "./sd";

// Heap allocations needed for this module.
let translationHeap = vec3.create(),
    rotationHeap = quat.create(),
    scaleHeap = vec3.create();

/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserTextureAnimation} textureAnimation
 */
function MdxTextureAnimation(model, textureAnimation) {
    this.sd = new MdxSdContainer(model, textureAnimation.tracks);
}

MdxTextureAnimation.prototype = {
    getTranslation(instance) {
        return this.sd.getValue(translationHeap, "KTAT", instance, vec3.ZERO);
    },

    getRotation(instance) {
        return this.sd.getValue(rotationHeap, "KTAR", instance, quat.DEFAULT);
    },

    getScale(instance) {
        return this.sd.getValue(scaleHeap, "KTAS", instance, vec3.ONE);
    }
};

export default MdxTextureAnimation;
