Mdx.GeosetAnimation = function (geosetAnimation, model) {
    this.alpha = geosetAnimation.alpha;
    this.color = geosetAnimation.color;
    this.geosetId = geosetAnimation.geosetId;
    this.sd = Mdx.parseSDTracks(geosetAnimation.tracks, model);
};
