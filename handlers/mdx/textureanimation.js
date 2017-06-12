/**
 * @constructor
 * @param {MdxModel} model
 * @param {TextureAnimation} textureAnimation
 */
function MdxTextureAnimation(model, textureAnimation) {
    this.sd = new MdxSdContainer(textureAnimation.tracks, model);
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
