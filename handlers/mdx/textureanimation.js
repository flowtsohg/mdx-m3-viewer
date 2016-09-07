function MdxTextureAnimation(textureAnimation, model) {
    this.sd = new MdxSdContainer(textureAnimation.tracks, model);
}

MdxTextureAnimation.prototype = {
    getTranslation(instance) {
        return this.sd.getKTATValue(instance, vec3.ZERO);
    },

    getRotation(instance) {
        return this.sd.getKTARValue(instance, quat.DEFAULT);
    },

    getScale(instance) {
        return this.sd.getKTASValue(instance, vec3.ONE);
    }
};
