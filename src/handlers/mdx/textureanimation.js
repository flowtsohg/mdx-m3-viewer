Mdx.TextureAnimation = function (textureAnimation, model) {
    this.sd = Mdx.parseSDTracks(textureAnimation.tracks, model);
    this.defval = vec3.create();
};

Mdx.TextureAnimation.prototype = {
    getTranslation: function (sequence, frame, counter) {
        if (this.sd.translation) {
            return this.sd.translation.getValue(sequence, frame, counter);
        } else {
            return this.defval;
        }
    }
};