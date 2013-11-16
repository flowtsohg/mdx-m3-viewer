// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function GL(element) {
  var gl;
  var identifiers = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  
  for (var i = 0, l = identifiers.length; i < l; ++i) {
    try {
      gl = element.getContext(identifiers[i], {antialias: true, alpha: false});
    } catch(e) {}

    if (gl) {
      break;
    }
  }
  
  if (!gl) {
    console.error("Could not create a WebGL context");
    return;
  }
  
  var projectionMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  var viewMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  var worldMatrix = [];
  var matrixStack = [];
  var textureStore = {};
  var textureNameStore = {};
  var shaderUnitStore = {};
  var shaderStore = {};
  var shaderUniformStore = {};
  var boundShader;
  var boundShaderName = "";
  var boundTextures = [];
  var glTypeToUniformType = {};
    
  glTypeToUniformType[gl.FLOAT] = "1f";
  glTypeToUniformType[gl.FLOAT_VEC2] = "2fv";
  glTypeToUniformType[gl.FLOAT_VEC3] = "3fv";
  glTypeToUniformType[gl.FLOAT_VEC4] = "4fv";
  glTypeToUniformType[gl.INT] = "1i";
  glTypeToUniformType[gl.INT_VEC2] = "2iv";
  glTypeToUniformType[gl.INT_VEC3] = "3iv";
  glTypeToUniformType[gl.INT_VEC4] = "4iv";
  glTypeToUniformType[gl.BOOL] = "1f";
  glTypeToUniformType[gl.BOOL_VEC2] = "2fv";
  glTypeToUniformType[gl.BOOL_VEC3] = "3fv";
  glTypeToUniformType[gl.BOOL_VEC4] = "4fv";
  glTypeToUniformType[gl.FLOAT_MAT2] = "Matrix2fv";
  glTypeToUniformType[gl.FLOAT_MAT3] = "Matrix3fv";
  glTypeToUniformType[gl.FLOAT_MAT4] = "Matrix4fv";
  glTypeToUniformType[gl.SAMPLER_2D] = "1i";
  glTypeToUniformType[gl.SAMPLER_CUBE] = "1i";
  
  var hasFloatTexture = gl.getExtension("OES_texture_float");
  var compressedTextures = gl.getExtension("WEBGL_compressed_texture_s3tc");
  var depthTextures = gl.getExtension("WEBGL_depth_texture");
  var multipleRenderTargets = gl.getExtension("WEBGL_draw_buffers");
  
  gl.viewport(0, 0, element.width, element.height);
	gl.depthFunc(gl.LEQUAL);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
  
  function viewSize(width, height) {
    gl.viewport(0, 0, width, height);
  }
  
  function setPerspective(fovy, aspect, near, far) {
    math.mat4.makePerspective(projectionMatrix, fovy, aspect, near, far);
  }
	/*
  function setOrtho(left, right, bottom, top, near, far) {
    math.mat4.makeOrtho(projectionMatrix, left, right, bottom, top, near, far);
  }
  
  function setBackground(red, green, blue) {
    gl.clearColor(red, green, blue, 1);
  }
  */
  function loadIdentity() {
    viewMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }
  
  function translate(x, y, z) {
    math.mat4.translate(viewMatrix, x, y, z);
  }
  
  function rotate(angle, x, y, z) {
    math.mat4.rotate(viewMatrix, angle, x, y, z);
  }
  
  function scale(x, y, z) {
    math.mat4.scale(viewMatrix, x, y, z);
  }
  
  function lookAt(eye, center, up) {
    math.mat4.makeLookAt(viewMatrix, eye, center, up);
  }
  
  function multMat(mat) {
    math.mat4.multMat(viewMatrix, mat, viewMatrix);
  }
  
  function pushMatrix() {
    matrixStack.push(Object.copy(viewMatrix));
  }
  
  function popMatrix() {
    viewMatrix = matrixStack.pop();
  }
  
  function newShaderUnit(source, type) {
    var hash = String.hashCode(source);
    
    if (!shaderUnitStore[hash]) {
      shaderUnitStore[hash] = new ShaderUnit(source, type);
    }
    
    return shaderUnitStore[hash];
  }
  
  function newShader(name, vertexSource, fragmentSource, defines) {
    if (!shaderStore[name]) {
      defines = defines || [];
      
      for (var i = 0; i < defines.length; i++) {
        defines[i] = "#define " + defines[i];
      }
      
      defines = defines.join("\n") + "\n";
      
      var vertexUnit = newShaderUnit(defines + vertexSource, gl.VERTEX_SHADER);
      var fragmentUnit = newShaderUnit(defines + fragmentSource, gl.FRAGMENT_SHADER);
      
      if (vertexUnit.ready && fragmentUnit.ready) {
        shaderStore[name] = new Shader(vertexUnit, fragmentUnit);
        shaderUniformStore[name] = {};
      }
    }
    
    if (!shaderStore[name] || !shaderStore[name].ready) {
      return false;
    }
    
    return shaderStore[name];
  }
  
  function ShaderUnit(source, type) {
    this.source = source;
    this.type = type;
    
    var id = gl.createShader(type);
    
    this.id = id;
    
    gl.shaderSource(id, source);
    gl.compileShader(id);
    
    if (gl.getShaderParameter(id, gl.COMPILE_STATUS)) {
      this.ready = true;
    } else {
      console.warn(gl.getShaderInfoLog(id));
      console.log(source);
    }
  }
  
  function Shader(vertexUnit, fragmentUnit) {
    this.vertexUnit = vertexUnit;
    this.fragmentUnit = fragmentUnit;
    
    var id = gl.createProgram();
    
    this.id = id;
      
    gl.attachShader(id, vertexUnit.id);
    gl.attachShader(id, fragmentUnit.id);
    gl.linkProgram(id);
	
    if (gl.getProgramParameter(id, gl.LINK_STATUS)) {
      this.uniforms = this.getParameters("Uniform", "UNIFORMS");
      this.attribs = this.getParameters("Attrib", "ATTRIBUTES");
      this.ready = true;
    } else {
      console.warn(gl.getProgramInfoLog(id));
    }
  }
  
  Shader.prototype = {
    getParameters: function (type, enumtype) {
      var id = this.id;
      var o = {};
        
      for (var i = 0, l = gl.getProgramParameter(id, gl["ACTIVE_" + enumtype]); i < l; i++) {
        var v = gl["getActive" + type](id, i);
        var location = gl["get" + type + "Location"](id, v.name);
        
        o[v.name] = [location, v.type];
      }
      
      return o;
    },
    
    setParameter: function (name, value) {
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
      } else {
        location = gl.getUniformLocation(this.id, name);
        
        // If the location exists, it means this name refers to a uniform array
        if (location) {
          // When accessing an active uniform array, the driver returns array_name[0]
          var arrayuniform = this.uniforms[name.match(/([\w]+)/)[1] + "[0]"];
          
          if (arrayuniform) {
            this.uniforms[name] = [location, arrayuniform[1]];
            
            // Now call this function again to run the actual binding.
            this.setParameter(name, value);
          }
        }
      }
    },
    
    getParameter: function (name) {
      return this.uniforms[name] || this.attribs[name];
    },
    
    bind: function () {
      if (this.ready) {
        gl.useProgram(this.id);
        
        var attribs = this.attribs;
        var keys = Object.keys(attribs);
          
        for (var i = 0, l = keys.length; i < l; i++) {
          gl.enableVertexAttribArray(attribs[keys[i]][0]);
        }
      }
    },
    
    unbind: function () {
      var attribs = this.attribs;
      var keys = Object.keys(attribs);
				
			for (var i = 0, l = keys.length; i < l; i++) {
				gl.disableVertexAttribArray(attribs[keys[i]][0]);
			}
      
      gl.useProgram(null);
    }
  };
  
  function bindShader(name) {
    var shader = shaderStore[name];
    
    if (shader && (!boundShader || boundShader.id !== shader.id)) {
      if (boundShader) {
        boundShader.unbind();
      }
      
      boundShaderName = name;
      boundShader = shader;
      boundShader.bind();
    }
  }
  
  function setParameter(name, value) {
    if (boundShader) {
      var oldValue = shaderUniformStore[boundShaderName][name];
      var isArray = value instanceof Array;
      var shouldSet = false;
      
      if (isArray) {
        if (!Array.equals(oldValue, value)) {
          shouldSet = true;
        }
      } else if (oldValue !== value) {
        shouldSet = true;
      }
      
      if (shouldSet) {
        shaderUniformStore[boundShaderName][name] = value;
        
        boundShader.setParameter(name, value);
      }
    }
  }
  
  function getParameter(name) {
    if (boundShader) {
      var parameter = boundShader.getParameter(name);
      
      if (parameter) {
        return parameter[0];
      }
    }
    
    return;
  }
  
  function bindWorldMatrix(uniform) {
    if (boundShader) {
      math.mat4.multMat(projectionMatrix, viewMatrix, worldMatrix);
      
      boundShader.setParameter(uniform, worldMatrix);
    }
  }
  
  function getWorldMatrix() {
    math.mat4.multMat(projectionMatrix, viewMatrix, worldMatrix);
    
    return worldMatrix;
  }
  
  function bindProjectionMatrix(uniform) {
    if (boundShader) {
      boundShader.setParameter(uniform, projectionMatrix);
    }
  }
  
  function getProjectionMatrix() {
    return projectionMatrix;
  }
  
  function bindViewMatrix(uniform) {
    if (boundShader) {
      boundShader.setParameter(uniform, viewMatrix);
    }
  }
  
  function getViewMatrix() {
    return viewMatrix;
  }
  
  function generateTexture(image, clampS, clampT) {
    var id = gl.createTexture();
    
    gl.bindTexture(gl.TEXTURE_2D, id);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, clampS ? gl.CLAMP_TO_EDGE : gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, clampT ? gl.CLAMP_TO_EDGE : gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    
    return id;
  }
  
  function Texture(name, source, clampS, clampT, onload, onerror) {
    this.name = name;
    
    // File name or Base64 string
    if (typeof source === "string") {
      this.image = new Image();
      
      var self = this;
      
      this.image.onload = function () {
        self.id = generateTexture(this, clampS, clampT);
        self.ready = true;
        
        textureNameStore[name] = 1;
        
        if (typeof onload === "function") {
          onload(name);
        }
      };
      
      this.image.onerror = function () {
        console.log("Failed to load " + name);
        
        if (typeof onerror === "function") {
          onerror(name);
        }
      };
      
      this.image.src = source;
    // Image object
    } else {
      this.image = source;
      
      this.id = generateTexture(source, clampS, clampT);
      
      this.ready = true;
      
      textureNameStore[name] = 1;
      
      if (typeof onload === "function") {
        onload(name);
      }
    }
  }
  
  Texture.prototype = {
    bind: function (unit) {
      if (this.ready) {
        gl.activeTexture(gl["TEXTURE" + (unit || 0)]);
        gl.bindTexture(gl.TEXTURE_2D, this.id);
      }
    },
    
    unbind: function () {
      gl.bindTexture(gl.TEXTURE_2D, 0);
    }
  };
  
  function onddsload(name, clampS, clampT, onload, e) {
    console.log("Processing " + name);
    
    var arraybuffer = e.target.response;
    var header = new Int32Array(arraybuffer, 0, 31);
    var magic = header[0];
    
    if (magic === 0x20534444) {
      console.log("It is a valid DDS file");
      var headerSize = header[1];
      var flags = header[2];
      var height = header[3];
      var width = header[4];
      var mipmaps = header[7];
      var fourCC = header[21];
      
      var dataOffset = headerSize + 4;
      var blockSize;
      var format;
      
      if (fourCC === 0x31545844) {
        blockSize = 8;
        format = compressedTextures.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        console.log("DXT1");
      } else if (fourCC === 0x33545844) {
        blockSize = 16;
        format = compressedTextures.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        console.log("DXT3");
      } else if (fourCC === 0x35545844) {
        blockSize = 16;
        format = compressedTextures.COMPRESSED_RGBA_S3TC_DXT5_EXT;
        console.log("DXT5");
      }
      
      if (format) {
        var mipmapsCount = Math.max(1, ((flags & 0x20000) ? mipmaps : 0));
        
        this.id = gl.createTexture();
        
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, clampS ? gl.CLAMP_TO_EDGE : gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, clampT ? gl.CLAMP_TO_EDGE : gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, (mipmapsCount > 1) ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR); // For some reason causes a WebGL texture incomplete error
                                                                                                                                                               // when using mipmapped linear filtering.
                                                                                                                                                               // Probably need to enable some extension, maybe related to float texture filtering?
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        
        for (var i = 0, l = mipmapsCount; i < l; i++) {
          // Anathema_diffuse.dds has 8 mipmap levels while the image size is 128x64 which means it can only have 6 mipmap levels.
          if (width >= 2 && height >= 2) {
            var dataSize = Math.max(4, width) / 4 * Math.max(4, height ) / 4 * blockSize;
            var byteArray = new Uint8Array(arraybuffer, dataOffset, dataSize);
            
            gl.compressedTexImage2D(gl.TEXTURE_2D, i, format, width, height, 0, byteArray);
            
            dataOffset += dataSize;
            width *= 0.5;
            height *= 0.5;
          }
        }
        
        gl.bindTexture(gl.TEXTURE_2D, null);
        
        console.log("Loaded");
        this.ready = true;
        
        textureNameStore[name] = 1;
        
        if (typeof onload === "function") {
          onload(name);
        }
      } else {
        console.warn(name + " is using a compression type that is not supported (supported types: DXT1, DXT3, DXT5)");
        
        if (typeof onerror === "function") {
          onerror(name);
        }
      }
    } else {
      console.warn(name + " is not a valid DDS file");
      
      if (typeof onerror === "function") {
        onerror(name);
      }
    }
  }
  
  function onddserror(name, onerror, e) {
    console.warn("Failed to load " + name);
    
    if (typeof onerror === "function") {
      onerror(name, e);
    }
  }
    
  function DDSTexture(name, source, clampS, clampT, onload, onerror) {
    this.name = name;
    
    console.log("Loading " + name);
    
    if (compressedTextures) {
      getFile(source, true, onddsload.bind(this, name, clampS, clampT, onload), onddserror.bind(this, name, onerror));
    } else {
      console.warn("Didn't load " + name + " because your WebGL context does not support compressed texture formats");
      
      if (typeof onerror === "function") {
        onerror(name);
      }
    }
  }
  
  DDSTexture.prototype = Texture.prototype;
  
  var extRegexp = /(?:\.([^.]+))?$/;
  
  function newTexture(name, source, clampS, clampT, onload, onerror) {
    if (textureStore[name]) {
      if (typeof onload === "function") {
        onload(name);
      }
    } else {
      var ext = extRegexp.exec(name)[1] || extRegexp.exec(source)[1];
      
      if (ext && ext.toLowerCase() === "dds") {
         textureStore[name] = new DDSTexture(name, source, clampS, clampT, onload, onerror);
      } else {
        textureStore[name] = new Texture(name, source, clampS, clampT, onload, onerror);
      }
    }
      
    return textureStore[name];
  }
  
  function bindTexture(name, unit) {
    var texture = textureStore[name];
    
    if (!texture || !texture.ready) {
      texture = textureStore["Empty.png"];
    }
    
    unit = unit || 0;
    
    if (!boundTextures[unit] || boundTextures[unit].name !== name) {
      boundTextures[unit] = texture;
      
      texture.bind(unit);
    }
  }
  
  function textureReady(name) {
    return textureNameStore[name] === 1;
  }
  
  function Rectangle(x, y, z, hw, hh, stscale) {
    stscale = stscale || 1;
    
    this.buffer = gl.createBuffer();
    this.data = new Float32Array([
      x - hw, y - hh, z, 0, 1 * stscale,
      x + hw, y - hh, z, 1 * stscale, 1 * stscale,
      x - hw, y + hh, z, 0, 0,
      x + hw, y + hh, z, 1 * stscale, 0
    ]);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.STATIC_DRAW);
  }
  
  Rectangle.prototype = {
    render: function () {
      if (boundShader) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        
        gl.vertexAttribPointer(getParameter("a_position"), 3, gl.FLOAT, false, 20, 0);
        gl.vertexAttribPointer(getParameter("a_uv"), 2, gl.FLOAT, false, 20, 12);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    }
  };
  
  function Sphere(x, y, z, latitudeBands, longitudeBands, radius) {
    var vertexData = [];
    var indexData = [];
    var latNumber;
    var longNumber;
    
    for (latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      var theta = latNumber * Math.PI / latitudeBands;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        var phi = longNumber * 2 * Math.PI / longitudeBands;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        var vx = cosPhi * sinTheta;
        var vy = cosTheta;
        var vz = sinPhi * sinTheta;
        var s = 1 - (longNumber / longitudeBands);
        var t = latNumber / latitudeBands;

        // Position
        vertexData.push(x + vx * radius);
        vertexData.push(y + vy * radius);
        vertexData.push(z + vz * radius);
        // Normal
        //vertexData.push(x);
        //vertexData.push(y);
        //vertexData.push(z);
        // Texture coordinate
        vertexData.push(s);
        vertexData.push(t);
      }
    }

    for (latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for (longNumber = 0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * (longitudeBands + 1)) + longNumber;
        var second = first + longitudeBands + 1;
        
        // First triangle
        indexData.push(first);
        indexData.push(second);
        indexData.push(first + 1);
        // Second triangle
        indexData.push(second);
        indexData.push(second + 1);
        indexData.push(first + 1);
      }
    }
    
    this.vertexArray = new Float32Array(vertexData);
    this.indexArray = new Uint16Array(indexData);
    
    this.vertexBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexArray, gl.STATIC_DRAW);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexArray, gl.STATIC_DRAW);
  }
  
  Sphere.prototype = {
    render: function () {
      if (boundShader) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        
        gl.vertexAttribPointer(getParameter("a_position"), 3, gl.FLOAT, false, 20, 0);
        gl.vertexAttribPointer(getParameter("a_uv"), 2, gl.FLOAT, false, 20, 12);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        
        gl.drawElements(gl.TRIANGLES, this.indexArray.length, gl.UNSIGNED_SHORT, 0);
      }
    },
    
    renderLines: function () {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        
        gl.vertexAttribPointer(getParameter("a_position"), 3, gl.FLOAT, false, 20, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        
        gl.drawElements(gl.LINES, this.indexArray.length, gl.UNSIGNED_SHORT, 0);
    }
  };
  
  function Cube(x1, y1, z1, x2, y2, z2) {
    this.buffer = gl.createBuffer();
    this.data = new Float32Array([
      x1, y2, z1,
      x1, y2, z2,
      x1, y2, z2,
      x2, y2, z2,
      x2, y2, z2,
      x2, y2, z1,
      x2, y2, z1,
      x1, y2, z1,
      x1, y1, z1,
      x1, y1, z2,
      x1, y1, z2,
      x2, y1, z2,
      x2, y1, z2,
      x2, y1, z1,
      x2, y1, z1,
      x1, y1, z1,
      x1, y1, z2,
      x1, y2, z2,
      x1, y2, z1,
      x1, y1, z1,
      x2, y1, z2,
      x2, y2, z2,
      x2, y2, z1,
      x2, y1, z1
    ]);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.STATIC_DRAW);
  }
  
  Cube.prototype = {
    renderLines: function () {
      if (boundShader) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        
        gl.vertexAttribPointer(getParameter("a_position"), 3, gl.FLOAT, false, 12, 0);
        
        gl.drawArrays(gl.LINES, 0, 24);
      }
    }
  };
  
  function newRectangle(x, y, z, hw, hh, stscale) {
    return new Rectangle(x, y, z, hw, hh, stscale);
  }
  
  function newSphere(x, y, z, latitudeBands, longitudeBands, radius) {
    return new Sphere(x, y, z, latitudeBands, longitudeBands, radius);
  }
  
  function newCube(x1, y1, z1, x2, y2, z2) {
    return new Cube(x1, y1, z1, x2, y2, z2);
  }
  
  // Create a black texture for textures that fail to load.
  newTexture("Empty.png", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAMSURBVBhXY0ACDAwAAA4AAXqxuTAAAAAASUVORK5CYII=");
  
  return {
    viewSize: viewSize,
    setPerspective: setPerspective,
    //setOrtho: setOrtho,
    //setBackground: setBackground,
    loadIdentity: loadIdentity,
    translate: translate,
    rotate: rotate,
    scale: scale,
    lookAt: lookAt,
    multMat: multMat,
    pushMatrix: pushMatrix,
    popMatrix: popMatrix,
    newShader: newShader,
    bindShader: bindShader,
    setParameter: setParameter,
    getParameter: getParameter,
    bindWorldMatrix: bindWorldMatrix,
    getWorldMatrix: getWorldMatrix,
    bindProjectionMatrix: bindProjectionMatrix,
    getProjectionMatrix: getProjectionMatrix,
    bindViewMatrix: bindViewMatrix,
    getViewMatrix: getViewMatrix,
    newTexture: newTexture,
    bindTexture: bindTexture,
    textureReady: textureReady,
    newRectangle: newRectangle,
    newSphere: newSphere,
    newCube: newCube,
    gl: gl,
    hasFloatTexture: hasFloatTexture
  };
}