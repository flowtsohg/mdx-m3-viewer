Mdx.GeosetAnimation = function (geosetAnimation, model) {
    var color = geosetAnimation.color;

    this.alpha = geosetAnimation.alpha;
    this.color = [color[2], color[1], color[0]];
    this.geosetId = geosetAnimation.geosetId;
    this.sd = new Mdx.SDContainer(geosetAnimation.tracks, model);
};

Mdx.GeosetAnimation.prototype = {
    getAlpha: function (sequence, frame, counter) {
        // The alpha variable doesn't seem to actually be used by the game?
        return this.sd.getKGAO(sequence, frame, counter, 1);
    },

    getColor: function (sequence, frame, counter) {
        return this.sd.getKGAC(sequence, frame, counter, this.color);
    }
};
