// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function GeosetAnimation(geosetAnimation, model) {
  this.alpha = geosetAnimation.alpha;
  this.color = geosetAnimation.color;
  this.geosetId = geosetAnimation.geosetId;
  this.sd = parseSDTracks(geosetAnimation.tracks, model);
}