Mdx.GeosetAnimation = function (geosetAnimation, model) {
    var color = geosetAnimation.color;

    this.alpha = geosetAnimation.alpha;
    this.color = [color[2], color[1], color[0]];
    this.geosetId = geosetAnimation.geosetId;
    this.sd = Mdx.parseSDTracks(geosetAnimation.tracks, model);
};

Mdx.GeosetAnimation.prototype = {
    getAlpha: function (sequence, frame, counter) {
        if (this.sd.alpha) {
            return this.sd.alpha.getValue(sequence, frame, counter);
        } else {
            return 1;
            // The alpha variable doesn't seem to actually be used by the game?
            //return this.alpha;
        }
    },

    getColor: function (sequence, frame, counter) {
        if (this.sd.color) {
            return this.sd.color.getValue(sequence, frame, counter);
        } else {
            return this.color;
        }
    }
};