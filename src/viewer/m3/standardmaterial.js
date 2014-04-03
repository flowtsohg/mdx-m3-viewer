// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function StandardMaterial(material, model) {
  this.name = material.name;
  this.specialFlags = material.specialFlags;
  this.flags = material.flags;
  this.blendMode = material.blendMode;
  this.priority = material.priority;
  this.specularity = material.specularity;
  this.specMult = material.specMult;
  this.emisMult = material.emisMult;
  this.layerBlendType = material.layerBlendType;
  this.emisBlendType = material.emisBlendType;
  this.emisMode = material.emisMode;
  
  this.layers = [
    new Layer(material.diffuseLayer, "diffuse", 2, model),
    new Layer(material.decalLayer, "decal", 2, model),
    new Layer(material.specularLayer, "specular", 2, model),
    new Layer(material.glossLayer, "gloss", 2, model),
    new Layer(material.emissiveLayer, "emissive", material.emisBlendType, model),
    new Layer(material.emissive2Layer, "emissive2", material.emisMode, model),
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
  
  bind: function (sequence, frame) {
    this.bindCommon();
    
    gl.setParameter("u_specularity", this.specularity);
    gl.setParameter("u_specMult", this.specMult);
    gl.setParameter("u_emisMult", this.emisMult);
    
    gl.setParameter("u_lightAmbient", [0.02, 0.02, 0.02, 0]);
    
    this.layers[0].bind(1, sequence, frame);
    this.layers[1].bind(2, sequence, frame);
    this.layers[2].bind(3, sequence, frame);
    this.layers[4].bind(5, sequence, frame);
    this.layers[5].bind(6, sequence, frame);
    this.layers[10].bind(11, sequence, frame);
    this.layers[12].bind(13, sequence, frame);
  },
  
  unbind: function () {
    ctx.disable(ctx.BLEND);
    ctx.enable(ctx.CULL_FACE);
    
    this.layers[0].unbind();
    this.layers[1].unbind();
    this.layers[2].unbind();
    this.layers[4].unbind();
    this.layers[5].unbind();
    this.layers[10].unbind();
    this.layers[12].unbind();
  },
  
  bindDiffuse: function (sequence, frame) {
    this.bindCommon();
    
    this.layers[0].bind(1, sequence, frame);
  },
  
  bindSpecular: function (sequence, frame) {
    this.bindCommon();
    
    gl.setParameter("u_specularity", this.specularity);
    gl.setParameter("u_specMult", this.specMult);
    
    this.layers[2].bind(3, sequence, frame);
  },
  
  bindNormalMap: function (sequence, frame) {
    this.bindCommon();
    
    this.layers[10].bind(11, sequence, frame);
  },
  
  bindEmissive: function (sequence, frame) {
    this.bindCommon();
    
    gl.setParameter("u_emisMult", this.emisMult);
    
    this.layers[4].bind(5, sequence, frame);
    this.layers[5].bind(6, sequence, frame);
  },
  
  bindDecal: function (sequence, frame) {
    this.bindCommon();
    
    this.layers[1].bind(2, sequence, frame);
  }
};