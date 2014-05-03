function ShaderUnit(source, type, name) {
  var id = ctx.createShader(type);
  
  this.source = source;
  this.type = type;
  this.id = id;
  
  ctx.shaderSource(id, source);
  ctx.compileShader(id);
  
  if (ctx.getShaderParameter(id, ctx.COMPILE_STATUS)) {
    this.ready = true;
  } else {
    console.warn("Failed to compile a shader:");
    console.warn(name, ctx.getShaderInfoLog(this.id));
    console.warn(source);
    unboundonerror({isShader: true, source: name}, "Compile");
  }
}

function Shader(name, vertexUnit, fragmentUnit) {
  var id = ctx.createProgram();
  
  this.name = name;
  this.vertexUnit = vertexUnit;
  this.fragmentUnit = fragmentUnit;
  this.id = id;
  this.nonexistingParameters = {};
    
  ctx.attachShader(id, vertexUnit.id);
  ctx.attachShader(id, fragmentUnit.id);
  ctx.linkProgram(id);
  
  if (ctx.getProgramParameter(id, ctx.LINK_STATUS)) {
    this.getVariables();
    this.ready = true;
  } else {
    console.warn(name, ctx.getProgramInfoLog(this.id));
    unboundonerror({isShader: true, name: name}, "Link");
  }
}

Shader.prototype = {
  getVariables: function () {
    var id = this.id;
    var variables = {};
    var i, l, v, location;
      
    for (i = 0, l = ctx.getProgramParameter(id, ctx.ACTIVE_UNIFORMS); i < l; i++) {
      v = ctx.getActiveUniform(id, i);
      location = ctx.getUniformLocation(id, v.name);
      
      variables[v.name] = location;
    }
    
    l = ctx.getProgramParameter(id, ctx.ACTIVE_ATTRIBUTES);
    
    for (i = 0; i < l; i++) {
      v = ctx.getActiveAttrib(id, i);
      location = ctx.getAttribLocation(id, v.name);
      
      variables[v.name] = location;
    }
    
    this.variables = variables;
    this.attribs = l;
  }
};