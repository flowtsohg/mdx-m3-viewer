function Layer(layer, type, op, model, textureMap) {
  this.uniform = "u_" + type;
  
  // Since Gloss doesn't exist in all versions
  if (layer) {
    var uvSource = layer.uvSource;
    
    this.flags = layer.flags;
    this.colorChannels = layer.colorChannels;
    
    this.model = model;
    this.type = type;
    this.op = op;
    
    // The path is overrided with the lower case because some models have the same texture multiple times but with different letter cases, which causes multiple fetches = wasted bandwidth, memory and time.
    var source = layer.imagePath.toLowerCase();
    
    if (source !== "") {
      this.source = source;
      
      var textureName = getFileName(source);
      var path;
      
      // Need to handle both the absolute path and relative.
      // Relative paths (name.dds) originate from the header.
      // Absolute paths (assets/textures/name.dds) originate from loading a scene.
      if (textureMap[textureName]) {
        path = textureMap[textureName];
      } else if (textureMap[source]) {
        path = textureMap[source];
      } else {
        path = urls.mpqFile(source);
      }
      
      model.textureMap[source] = path;
      
      gl.newTexture(path, layer.flags & 0x4, layer.flags & 0x8);
    }
    
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
  bind: function (unit, sequence, frame, textureMap) {
    var source = this.source;
    var settings = this.uniform + "LayerSettings.";
    
    if (source) {
      gl.setParameter(this.uniform + "Map", unit);
      
      bindTexture(source, unit, this.model.textureMap, textureMap);
      
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
  
  overrideTexture: function (path) {
    this.path = path;
    this.overrided = true;
  }
};