// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

var filterModeToRenderOrder = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 3,
  5: 3,
  6: 3
};

function Layer(layer, geosetId, model) {
  this.filterMode = layer.filterMode;
  this.twoSided = layer.twoSided;
  this.textureId = layer.textureId;
  this.textureAnimationId = layer.textureAnimationId;
  this.coordId = layer.coordId;
  this.alpha = layer.alpha;
  this.renderOrder = filterModeToRenderOrder[layer.filterMode] || 0;
  this.geosetId = geosetId;
  this.sd = parseSDTracks(layer.tracks, model);
}

Layer.prototype = {
  setMaterial: function () {
    var filterMode = this.filterMode;
    
    if (filterMode === 1) {
      gl.setParameter("u_type", [1, 0, 0]);
      
      ctx.depthMask(1);
      ctx.disable(ctx.BLEND);
    } else if (filterMode === 2) {
      gl.setParameter("u_type", [0, 0, 0]);
      
      ctx.depthMask(0);
      ctx.enable(ctx.BLEND);
      ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
    } else if (filterMode === 3) {
      gl.setParameter("u_type", [0, 1, 0]);
      
      ctx.enable(ctx.BLEND);
      ctx.depthMask(0);
      ctx.blendFunc(ctx.SRC_COLOR, ctx.ONE);
    } else if (filterMode === 4) {
      gl.setParameter("u_type", [0, 0, 0]);
      
      ctx.depthMask(0);
      ctx.enable(ctx.BLEND);
      ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
    } else if (filterMode === 5 || filterMode === 6) {
      gl.setParameter("u_type", [0, 0, 1]);
      
      ctx.depthMask(0);
      ctx.enable(ctx.BLEND);
      ctx.blendFunc(ctx.SRC_ZERO, ctx.SRC_COLOR);
    } else {
      gl.setParameter("u_type", [0, 0, 0]);
      
      ctx.depthMask(1);
      ctx.disable(ctx.BLEND);
    }
    
    if (this.twoSided) {
      ctx.disable(ctx.CULL_FACE);
    } else {
      ctx.enable(ctx.CULL_FACE);
    }
  },
  
  shouldRender: function (sequence, frame, counter) {
    return getSDValue(sequence, frame, counter, this.sd.alpha, 1) > 0.1;
  }
};