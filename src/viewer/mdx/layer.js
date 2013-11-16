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
  var keys = Object.keys(layer);
  
  for (var i = keys.length; i--;) {
    var key = keys[i];
    
    this[key] = layer[key];
  }
  
  this.model = model;
  this.geosetId = geosetId;
  this.renderOrder = filterModeToRenderOrder[layer.filterMode] || 0;
}

Layer.prototype = {
  setMaterial: function () {
    switch (this.filterMode) {
      case 1:
        gl.setParameter("u_type", [1, 0, 0]);
        
        ctx.depthMask(1);
        ctx.disable(ctx.BLEND);
      
        break;
      case 2:
        gl.setParameter("u_type", [0, 0, 0]);
        
        ctx.depthMask(0);
        ctx.enable(ctx.BLEND);
        ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
        
        break;
      case 3:
        gl.setParameter("u_type", [0, 1, 0]);
        
        ctx.enable(ctx.BLEND);
        ctx.depthMask(0);
        ctx.blendFunc(ctx.SRC_COLOR, ctx.ONE);
        
        break;
      case 4:
        gl.setParameter("u_type", [0, 0, 0]);
        
        ctx.depthMask(0);
        ctx.enable(ctx.BLEND);
        ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
        
        break;
      case 5:
      case 6:
        gl.setParameter("u_type", [0, 0, 1]);
        
        ctx.depthMask(0);
        ctx.enable(ctx.BLEND);
        ctx.blendFunc(ctx.SRC_ZERO, ctx.SRC_COLOR);
        
        break;
      default:
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
  
  shouldRender: function () {
    return (getTrack(this.tracks.alpha, 1, this.model) > 0.1);
  }
};