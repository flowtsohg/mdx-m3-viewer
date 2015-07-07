Mdx.TextureAnimation = function (textureAnimation, model) {
    this.sd = new Mdx.SDContainer(textureAnimation.tracks, model);
    this.defaultTranslation = vec3.create();
    this.defaultRotation = quat.create();
    this.defaultScale = vec3.fromValues(1, 1, 1);
};

Mdx.TextureAnimation.prototype = {
    getTranslation: function (sequence, frame, counter) {
        return this.sd.getKTAT(sequence, frame, counter, this.defaultTranslation);
    },

    getRotation: function (sequence, frame, counter) {
        return this.sd.getKTAR(sequence, frame, counter, this.defaultRotation);
    },

    getScale: function (sequence, frame, counter) {
        return this.sd.getKTAS(sequence, frame, counter, this.defaultScale);
    }
};
