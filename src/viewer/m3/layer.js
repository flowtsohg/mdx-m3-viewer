function Layer(layer, type, op, model, textureMap) {
  this.active = false;
  
  // Since Gloss doesn't exist in all versions
  if (layer) {
    var uvSource = layer.uvSource;
    
    this.flags = layer.flags;
    this.colorChannels = layer.colorChannels;
    
    this.model = model;
    this.type = type;
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
    
    var uniform = "u_" + type;
    
    var settings = uniform + "LayerSettings.";
    
    this.uniforms = {
      map: uniform + "Map",
      enabled: settings + "enabled",
      op: settings + "op",
      channels: settings + "channels",
      teamColorMode: settings + "teamColorMode",
      invert: settings + "invert",
      clampResult: settings + "clampResult",
      uvCoordinate: settings + "uvCoordinate"
    };
    
    this.invert = layer.flags & 0x10;
    this.clampResult = layer.flags & 0x20;
    
    this.teamColorMode = (type === "diffuse") & 1;
      
    // The path is overrided with the lower case because some models have the same texture multiple times but with different letter cases, which causes multiple fetches = wasted bandwidth, memory and time.
    var source = layer.imagePath.toLowerCase();
    
    if (source !== "") {
      this.source = source;
      
      var path;
      
      if (textureMap[source]) {
        path = textureMap[source];
      } else {
        path = urls.mpqFile(source);
      }
      
      model.textureMap[source] = path;
      
      gl.newTexture(path);
      
      this.active = true;
    }
  }
}

Layer.prototype = {
  bind: function (unit, sequence, frame, textureMap, shader) {
    var variables = shader.variables;
    var uniforms = this.uniforms;
    
    if (this.active) {
      ctx.uniform1i(variables[uniforms.map], unit);
      //gl.setParameter(this.uniform + "Map", unit);
      
      bindTexture(this.source, unit, this.model.textureMap, textureMap);
      
      ctx.uniform1f(variables[uniforms.enabled], 1);
      ctx.uniform1f(variables[uniforms.op], this.op);
      ctx.uniform1f(variables[uniforms.channels], this.colorChannels);
      //gl.setParameter(settings + "enabled", 1);
      //gl.setParameter(settings + "op", this.op);
      //gl.setParameter(settings + "channels", this.colorChannels);
      
      ctx.uniform1f(variables[uniforms.teamColorMode], this.teamColorMode);
      //if (this.isDiffuse) {
      //  ctx.uniform1f(variables[uniforms.teamColorMode], 1);
        //gl.setParameter(settings + "teamColorMode", 1);
      // I am not sure if the emissive team color mode is even used, since so far combineColors takes care of it.
      //} else if ((type === "emissive" || type === "emissive2") && this.colorChannels === 2) {
      //  gl.setParameter(uniform + "teamColorMode", 2);
      //} else {
      //  ctx.uniform1f(variables[uniforms.teamColorMode], 0);
        //gl.setParameter(settings + "teamColorMode", 0);
      //}
      
      // Alpha is probably unknown12. Can this be confirmed?
      // Many of these flags seem to be incorrect
      //gl.setParameter(uniform + "multAddAlpha", [this.model.getValue(this.rgbMultiply, sequence, frame), this.model.getValue(this.rgbAdd, sequence, frame), 0]);
      //gl.setParameter(uniform + "useAlphaFactor", 0);
      
      ctx.uniform1f(variables[uniforms.invert], this.invert);
      //gl.setParameter(settings + "invert", this.flags & 0x10);
      
      //gl.setParameter(uniform + "multColor", 0);
      //gl.setParameter(uniform + "addColor", 0);
      
      ctx.uniform1f(variables[uniforms.clampResult], this.clampResult);
      //gl.setParameter(settings + "clampResult", this.flags & 0x20);
      
      //gl.setParameter(uniform + "useConstantColor", this.flags && 0x400);
      //gl.setParameter(uniform + "constantColor", this.model.getValue(this.color, sequence, frame));
      //gl.setParameter(settings + "uvSource", this.uvSource);
      
      ctx.uniform1f(variables[uniforms.uvCoordinate], this.uvCoordinate);
      //gl.setParameter(settings + "uvCoordinate", this.uvCoordinate);
    } else {
      ctx.uniform1f(variables[uniforms.enabled], 0);
      //gl.setParameter(settings + "enabled", 0);
    }
  },
  
  unbind: function (shader) {
    if (this.active) {
      ctx.uniform1f(shader.variables[this.uniforms.enabled], 0);
      //gl.setParameter(this.uniform + "LayerSettings.enabled", 0);
    }
  }
};