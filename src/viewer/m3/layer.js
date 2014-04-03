// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function Layer(layer, type, op, model) {
  this.imagePath = "";
  this.uniform = "u_" + type;
  
  // Since Gloss doesn't exist in all versions
  if (layer) {
    var uvSource = layer.uvSource;
    
    this.flags = layer.flags;
    this.colorChannels = layer.colorChannels;
    
    this.model = model;
    this.type = type;
    
    var imagePath = layer.imagePath.toLowerCase();
    
    if (imagePath !== "") {
    // The path is overrided with the lower case because some models have the same texture multiple times but with different letter cases, which causes multiple fetches = wasted bandwidth, memory and time.
      this.imagePath = imagePath.toLowerCase();
	  
      var texturePaths = model.texturePaths;
      
      if (!texturePaths[imagePath]) {
        var texture = gl.newTexture(imagePath, url.mpqFile(imagePath), true, true);
        
        texturePaths[imagePath] = texture;
      
        var clampS = (this.flags & 0x4);
        var clampT = (this.flags & 0x8);
        
        this.glTexture = texture;
      } else {
        this.glTexture = texturePaths[imagePath];
      }
    }
    
    this.op = op;
    
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
  bind: function (unit, sequence, frame) {
    var imagePath = this.imagePath;
    var settings = this.uniform + "LayerSettings.";
    
    if (imagePath !== "" && gl.textureReady(imagePath)) {
      gl.setParameter(this.uniform + "Map", unit);
      this.glTexture.bind(unit);
      
      gl.setParameter(settings + "enabled", 1);
      gl.setParameter(settings + "op", this.op);
      gl.setParameter(settings + "channels", this.colorChannels);
      
      if (this.type === "diffuse") {
        gl.setParameter(settings + "teamColorMode", 1);
      // I am not sure if the emissive team color mode is even used, since so far combineColors takes care of it.
      //} else if ((type === "emissive" || type === "emissive2") && this.colorChannels === 2) {
      //  gl.setParameter(uniform + "teamColorMode", 2);
      } else {
        gl.setParameter(settings + "teamColorMode", 0);
      }
      
      // Alpha is probably unknown12. Can this be confirmed?
      // Many of these flags seem to be incorrect
      //gl.setParameter(uniform + "multAddAlpha", [this.model.getValue(this.rgbMultiply, sequence, frame), this.model.getValue(this.rgbAdd, sequence, frame), 0]);
      //gl.setParameter(uniform + "useAlphaFactor", 0);
      gl.setParameter(settings + "invert", this.flags & 0x10);
      //gl.setParameter(uniform + "multColor", 0);
      //gl.setParameter(uniform + "addColor", 0);
      gl.setParameter(settings + "clampResult", this.flags & 0x20);
      //gl.setParameter(uniform + "useConstantColor", this.flags && 0x400);
      //gl.setParameter(uniform + "constantColor", this.model.getValue(this.color, sequence, frame));
      //gl.setParameter(settings + "uvSource", this.uvSource);
      gl.setParameter(settings + "uvCoordinate", this.uvCoordinate);
    } else {
      gl.setParameter(settings + "enabled", 0);
    }
  },
  
  unbind: function () {
    if (this.imagePath !== "") {
      gl.setParameter(this.uniform + "LayerSettings.enabled", 0);
    }
  },
  
  overrideTexture: function (newpath, onload, onerror, onprogress) {
     this.glTexture = gl.newTexture(newpath, url.mpqFile(newpath), false, false, onload, onerror);
  }
};