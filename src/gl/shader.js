function ShaderUnit(source, type, name) {
  var id = gl["createShader"](type);
  
  this.source = source;
  this.type = type;
  this.id = id;
  
  gl["shaderSource"](id, source);
  gl["compileShader"](id);
  
  if (gl["getShaderParameter"](id, gl["COMPILE_STATUS"])) {
    this.ready = true;
  } else {
    console.warn(name, gl["getShaderInfoLog"](this.id));
    unboundonerror({isShader: true, source: name}, "Compile");
  }
}

function Shader(name, vertexUnit, fragmentUnit) {
  var id = gl["createProgram"]();
  
  this.name = name;
  this.vertexUnit = vertexUnit;
  this.fragmentUnit = fragmentUnit;
  this.id = id;
  this.nonexistingParameters = {};
    
  gl["attachShader"](id, vertexUnit.id);
  gl["attachShader"](id, fragmentUnit.id);
  gl["linkProgram"](id);
  
  if (gl["getProgramParameter"](id, gl["LINK_STATUS"])) {
    this.uniforms = this.getParameters("Uniform", "UNIFORMS");
    this.attribs = this.getParameters("Attrib", "ATTRIBUTES");
    this.ready = true;
  } else {
    console.warn(name, gl["getProgramInfoLog"](this.id));
    unboundonerror({isShader: true, name: name}, "Link");
  }
}

Shader.prototype = {
  getParameters: function (type, enumtype) {
    var id = this.id;
    var o = {};
      
    for (var i = 0, l = gl["getProgramParameter"](id, gl["ACTIVE_" + enumtype]); i < l; i++) {
      var v = gl["getActive" + type](id, i);
      var location = gl["get" + type + "Location"](id, v.name);
      
      o[v.name] = [location, v.type];
    }
    
    return o;
  },
  
  setParameter: function (name, value) {
    if (parameterMap) {
      var tokens = name.split(".");
      
      name = parameterMap[tokens[0]];
      
      if (tokens[1]) {
        name += "." + memberMap[tokens[1]];
      }
    }
    
    var uniform = this.uniforms[name];
    var location;
    
    if (uniform) {
      location = uniform[0];
      
      var typeFunc = glTypeToUniformType[uniform[1]];
      
      if (typeFunc[0] === 'M') {
        gl["uniform" + typeFunc](location, false, value);
      } else {
        gl["uniform" + typeFunc](location, value);
      }
    // Avoid repeatedly calling getUniformLocation for something that doesn't exist
    } else if (!this.nonexistingParameters[name]) {
      location = gl["getUniformLocation"](this.id, name);
      
      // If the location exists, it means this name refers to a uniform array
      if (location) {
        // When accessing an active uniform array, the driver returns array_name[0]
        var arrayuniform = this.uniforms[name.match(/([\w]+)/)[1] + "[0]"];
        
        if (arrayuniform) {
          this.uniforms[name] = [location, arrayuniform[1]];
          
          // Now call this function again to run the actual binding.
          this.setParameter(name, value);
        }
      } else {
        this.nonexistingParameters[name] = 1;
      }
    }
  },
  
  getParameter: function (name) {
    if (parameterMap) {
      var tokens = name.split(".");
      
      name = parameterMap[tokens[0]]
      
      if (tokens[1]) {
        name += "." + memberMap[tokens[1]];
      }
    }
    
    return this.uniforms[name] || this.attribs[name];
  },
  
  bind: function () {
    if (this.ready) {
      gl["useProgram"](this.id);
      
      var attribs = this.attribs;
      var keys = Object.keys(attribs);
        
      for (var i = 0, l = keys.length; i < l; i++) {
        gl["enableVertexAttribArray"](attribs[keys[i]][0]);
      }
    }
  },
  
  unbind: function () {
    var attribs = this.attribs;
    var keys = Object.keys(attribs);
      
    for (var i = 0, l = keys.length; i < l; i++) {
      gl["disableVertexAttribArray"](attribs[keys[i]][0]);
    }
    
    gl["useProgram"](null);
  }
};