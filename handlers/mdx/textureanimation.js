import { vec3, quat } from "gl-matrix";
import MdxSdContainer from "./sd";

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
        return this.sd.getValue("KTAT", instance, vec3.ZERO);
    },

    getRotation(instance) {
        return this.sd.getValue("KTAR", instance, quat.DEFAULT);
    },

    getScale(instance) {
        return this.sd.getValue("KTAS", instance, vec3.ONE);
    }
};

export default MdxTextureAnimation;
