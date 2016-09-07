function MdxGeosetAnimation(geosetAnimation, model) {
    var color = geosetAnimation.color;

    this.alpha = geosetAnimation.alpha;
    this.color = [color[2], color[1], color[0]];
    this.geosetId = geosetAnimation.geosetId;
    this.sd = new MdxSdContainer(geosetAnimation.tracks, model);
}

MdxGeosetAnimation.prototype = {
    getAlpha(instance) {
        // The alpha variable doesn't seem to actually be used by the game?
        return this.sd.getKGAOValue(instance, 1);
    },

    isAlphaVariant(sequence) {
        return this.sd.isKGAOVariant(sequence);
    },

    getColor(instance) {
        return this.sd.getKGACValue(instance, this.color);
    }
};
