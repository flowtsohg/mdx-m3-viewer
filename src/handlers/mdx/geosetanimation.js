function GeosetAnimation(geosetAnimation, model) {
    this.alpha = geosetAnimation.alpha;
    this.color = geosetAnimation.color;
    this.geosetId = geosetAnimation.geosetId;
    this.sd = parseSDTracks(geosetAnimation.tracks, model);
}