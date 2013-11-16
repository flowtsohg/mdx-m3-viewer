// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function Layer(layer, type, op, model) {
  this.imagePath = "";
  
  if (layer) { // Since Gloss doesn't exist in all versions
    var keys = Object.keys(layer);
    
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      
      this[key] = layer[key];
    }
    
    this.model = model;
    this.type = type;
    
    var imagePath = layer.imagePath.toLowerCase();
    
    if (imagePath !== "") {
    // The path is overrided with the lower case because some models have the same texture multiple times but with different letter cases, which causes multiple fetches = wasted bandwidth, memory and time.
      this.imagePath = imagePath.toLowerCase();
      
      var texturePaths = model.texturePaths;
      
      if (!texturePaths[imagePath]) {
        texturePaths[imagePath] = 1;
      
        var clampS = (this.flags & 0x4);
        var clampT = (this.flags & 0x8);
        
        gl.newTexture(imagePath, url.mpqFile(imagePath), true, true);
      }
    }
    
    this.op = op;
    
    var uvSource = this.uvSource;
    var uvCoordinate = 0;
  
    if (uvSource === 1) {
      uvCoordinate = 1;
    } else if (uvSource === 9) {
      uvCoordinate = 2;
    } else if (uvSource === 10) {
      uvCoordinate = 3;
    }
    
    this.uvCoordinate = uvCoordinate;
  }
}

Layer.prototype = {
  bind: function (unit) {
    var imagePath = this.imagePath;
    
    if (imagePath !== "" && gl.textureReady(imagePath)) {
      var type = this.type;
      var name = "u_" + type;
      var uniform = name + "LayerSettings.";
      
      gl.setParameter(name + "Map", unit);
      gl.bindTexture(imagePath, unit);
      
      gl.setParameter(uniform + "enabled", 1);
      gl.setParameter(uniform + "op", this.op);
      gl.setParameter(uniform + "channels", this.colorChannels);
      
      if (type == "diffuse") {
        gl.setParameter(uniform + "teamColorMode", 1);
      // I am not sure if the emissive team color mode is even used, since so far combineColors takes care of it.
      //} else if ((type === "emissive" || type === "emissive2") && this.colorChannels === 2) {
      //  gl.setParameter(uniform + "teamColorMode", 2);
      } else {
        gl.setParameter(uniform + "teamColorMode", 0);
      }
      
      // Alpha is probably unknown12. Can this be confirmed?
      // Many of these flags seem to be incorrect
      gl.setParameter(uniform + "multAddAlpha", [this.model.getValue(this.rgbMultiply), this.model.getValue(this.rgbAdd), 0]);
      gl.setParameter(uniform + "useAlphaFactor", 0);
      gl.setParameter(uniform + "invert", this.flags & 0x10);
      gl.setParameter(uniform + "multColor", 0);
      gl.setParameter(uniform + "addColor", 0);
      gl.setParameter(uniform + "clampResult", this.flags & 0x20);
      gl.setParameter(uniform + "useConstantColor", this.flags && 0x400);
      gl.setParameter(uniform + "constantColor", this.model.getValue(this.color));
      gl.setParameter(uniform + "uvSource", this.uvSource);
      gl.setParameter(uniform + "uvCoordinate", this.uvCoordinate);
    } else {
      gl.setParameter(uniform + "enabled", 0);
    }
  },
  
  unbind: function () {
    gl.setParameter("u_" + this.type + "LayerSettings.enabled", 0);
  }
};