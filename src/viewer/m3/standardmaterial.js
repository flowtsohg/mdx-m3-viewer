// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function StandardMaterial(material, model) {
  var keys = Object.keys(material);
  
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    
    this[key] = material[key];
  }
  
  this.layers = [
    new Layer(material.diffuseLayer, "diffuse", 2, model),
    new Layer(material.decalLayer, "decal", 2, model),
    new Layer(material.specularLayer, "specular", 2, model),
    new Layer(material.glossLayer, "gloss", 2, model),
    new Layer(material.emissiveLayer, "emissive", this.emisBlendType, model),
    new Layer(material.emissive2Layer, "emissive2", this.emisMode, model),
    new Layer(material.evioLayer, "evio", 2, model),
    new Layer(material.evioMaskLayer, "evioMask", 2, model),
    new Layer(material.alphaMaskLayer, "alphaMask", 2, model),
    new Layer(material.alphaMask2Layer, "alphaMask2", 2, model),
    new Layer(material.normalLayer, "normal", 2, model),
    new Layer(material.heightLayer, "heightMap", 2, model),
    new Layer(material.lightMapLayer, "lightMap", 2, model),
    new Layer(material.ambientOcclusionLayer, "ao", 2, model)
  ];
}

StandardMaterial.prototype = {
  bindCommon: function () {
     if (this.blendMode === 1) {
      ctx.enable(ctx.BLEND);
      ctx.blendFunc(ctx.ONE, ctx.ONE);
    } else if (this.blendMode === 2) {
      ctx.enable(ctx.BLEND);
      ctx.blendFunc(ctx.ONE, ctx.ONE);
    } else {
      ctx.disable(ctx.BLEND);
    }
      
    if (this.flags & 0x8) {
      ctx.disable(ctx.CULL_FACE);
    } else {
      ctx.enable(ctx.CULL_FACE);
    }
  },
  
  bind: function () {
   this.bindCommon();
    
    gl.setParameter("u_specularity", this.specularity);
    gl.setParameter("u_specMult", this.specMult);
    gl.setParameter("u_emisMult", this.emisMult);
    
    gl.setParameter("u_lightAmbient", [0.02, 0.02, 0.02, 0]);
    
    for (var i = 0; i < 14; i++) {
      this.layers[i].bind(i + 1);
    }
  },
  
  unbind: function () {
    ctx.disable(ctx.BLEND);
    ctx.enable(ctx.CULL_FACE);
    
    for (var i = 0; i < 14; i++) {
      this.layers[i].unbind();
    }
  },
  
  bindDiffuse: function () {
    this.bindCommon();
    
    this.layers[0].bind(1);
  },
  
  bindSpecular: function () {
    this.bindCommon();
    
    gl.setParameter("u_specularity", this.specularity);
    gl.setParameter("u_specMult", this.specMult);
    
    this.layers[2].bind(3);
  },
  
  bindNormalMap: function () {
    this.bindCommon();
    
    this.layers[10].bind(11);
  },
  
  bindEmissive: function () {
    this.bindCommon();
    
    gl.setParameter("u_emisMult", this.emisMult);
    
    this.layers[4].bind(5);
    this.layers[5].bind(6);
  },
  
  bindDecal: function () {
    this.bindCommon();
    
    this.layers[1].bind(2);
  }
};