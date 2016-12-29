function MdxGeosetAnimation(geosetAnimation, model) {
    this.alpha = geosetAnimation.alpha;
    this.color = [...geosetAnimation.color].reverse(); // Stored as RGB, but animated colors are stored as BGR, so sizzle.
    this.geosetId = geosetAnimation.geosetId;
    this.sd = new MdxSdContainer(geosetAnimation.tracks, model);
}

MdxGeosetAnimation.prototype = {
    getAlpha(instance) {
        // The alpha variable doesn't seem to actually be used by the game?
        return this.sd.getValue("KGAO", instance, 1);
    },

    isAlphaVariant(sequence) {
        return this.sd.isVariant("KGAO", sequence);
    },

    getColor(instance) {
        let color = this.sd.getValue("KGAC", instance, this.color);

        // Some Blizzard models have values greater than 1, which messes things up.
        // Geoset animations are supposed to modulate colors, not intensify them.
        color[0] = Math.min(color[0], 1);
        color[1] = Math.min(color[1], 1);
        color[2] = Math.min(color[2], 1);

        return color;
    }
};
