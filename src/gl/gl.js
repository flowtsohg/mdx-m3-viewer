function setPerspective(fovy, aspect, near, far) {
  mat4.perspective(projectionMatrix, fovy, aspect, near, far);
  refreshViewProjectionMatrix = true;
}

function setOrtho(left, right, bottom, top, near, far) {
  mat4.ortho(projectionMatrix, left, right, bottom, top, near, far);
  refreshViewProjectionMatrix = true;
}

function loadIdentity() {
  mat4.identity(viewMatrix);
  refreshViewProjectionMatrix = true;
}

function translate(v) {
  mat4.translate(viewMatrix, viewMatrix, v);
  refreshViewProjectionMatrix = true;
}

function rotate(radians, axis) {
  mat4.rotate(viewMatrix, viewMatrix, radians, axis);
  refreshViewProjectionMatrix = true;
}

function scale(v) {
  mat4.scale(viewMatrix, viewMatrix, v);
  refreshViewProjectionMatrix = true;
}

function lookAt(eye, center, up) {
  mat4.lookAt(viewMatrix, eye, center, up);
  refreshViewProjectionMatrix = true;
}

function multMat(mat) {
  mat4.multiply(viewMatrix, viewMatrix, mat);
  refreshViewProjectionMatrix = true;
}

function pushMatrix() {
  matrixStack.push(mat4.clone(viewMatrix));
  refreshViewProjectionMatrix = true;
}

function popMatrix() {
  viewMatrix = matrixStack.pop();
  refreshViewProjectionMatrix = true;
}

function getViewProjectionMatrix() {
  if (refreshViewProjectionMatrix) {
    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);
    refreshViewProjectionMatrix = false;
  }
  
  return viewProjectionMatrix;
}

function getProjectionMatrix() {
  return projectionMatrix;
}

function getViewMatrix() {
  return viewMatrix;
}

function createShaderUnit(source, type, name) {
  var hash = String.hashCode(source);
  
  if (!shaderUnitStore[hash]) {
    shaderUnitStore[hash] = new ShaderUnit(source, type, name);
  }
  
  return shaderUnitStore[hash];
}

function createShader(name, vertexSource, fragmentSource, defines) {
  if (!shaderStore[name]) {
    defines = defines || [];
    
    for (var i = 0; i < defines.length; i++) {
      defines[i] = "#define " + defines[i];
    }
    
    defines = defines.join("\n") + "\n";
    
    var vertexUnit = createShaderUnit(defines + vertexSource, ctx.VERTEX_SHADER, name);
    var fragmentUnit = createShaderUnit(floatPrecision + defines + fragmentSource, ctx.FRAGMENT_SHADER, name);
    
    if (vertexUnit.ready && fragmentUnit.ready) {
      shaderStore[name] = new Shader(name, vertexUnit, fragmentUnit);
    }
  }
  
  if (shaderStore[name] && shaderStore[name].ready) {
    return shaderStore[name];
  }
}

function shaderStatus(name) {
  var shader = shaderStore[name];
  
  return shader && shader.ready;
}

function enableVertexAttribs(start, end) {
  for (var i = start; i < end; i++) {
    ctx.enableVertexAttribArray(i);
  }
}

function disableVertexAttribs(start, end) {
  for (var i = start; i < end; i++) {
    ctx.disableVertexAttribArray(i);
  }
}

function bindShader(name) {
  var shader = shaderStore[name];
  
  if (shader && (!boundShader || boundShader.id !== shader.id)) {
    var oldAttribs = 0;
    
    if (boundShader) {
      oldAttribs = boundShader.attribs;
    }
    
    var newAttribs = shader.attribs;
    
    ctx.useProgram(shader.id);
    
    if (newAttribs > oldAttribs) {
      enableVertexAttribs(oldAttribs, newAttribs);
    } else if (newAttribs < oldAttribs) {
      disableVertexAttribs(newAttribs, oldAttribs);
    }
    
    boundShaderName = name;
    boundShader = shader;
  }
  
  return boundShader;
}

function onloadTexture(source, handler, options, e) {
  var target = e.target,
        status = target.status;
    
  if (status === 200) {
    textureStore[source] = new handler(target.response, options, onerror.bind(undefined, {isTexture: 1, source: source}), ctx);
    
    if (textureStore[source].ready) {
      onload({isTexture: 1, source: source});
    }
  } else {
    onerror({isTexture: 1, source: source}, "" + status);
  }
}

function loadTexture(source, options) {
  // Only load a texture if it wasn't already loaded, and isn't in the middle of loading.
  if (!textureStore[source] && !textureLoading[source]) {
    var fileType = getFileExtension(source).toLowerCase(),
          handler = textureHandlers[fileType];
    
    if (handler) {
      textureLoading[source] = 1;
      
      onloadstart({isTexture: 1, source: source});
      
      // The normal texture uses a normal Image object to load the data.
      // This is because using a Blob seems to randomly not work, and it also doesn't cache requests.
      if (fileType === "png" || fileType === "gif" || fileType === "jpg") {
        textureStore[source] = new handler(source, onload, onerror, ctx);
      } else {
        getFile(source, true, onloadTexture.bind(undefined, source, handler, options || {}), onerror, onprogress.bind(undefined, {isTexture: true, source: source}));
      }
    } else {
      console.log("Error: no texture handler for file type " + fileType);
    }
  }
  
  return textureStore[source];
}

function unloadTexture(source) {
  if (textureStore[source]) {
    delete textureStore[source];
    
    onunload({isTexture: true, source: source});
  }
}

function bindTexture(object, unit) {
  var finalTexture;
  
  if (object) {
    if (typeof object === "string") {
      var texture = textureStore[object];
      
      if (texture && texture.ready) {
        finalTexture = texture;
      }
    } else if (object.ready) {
      finalTexture = object;
    }
  }
  
  unit = unit || 0;
  
  // This happens if the texture doesn't exist, or if it exists but didn't finish loading yet, or if asked to unbind (the given object is null).
  if (!finalTexture) {
    boundTextures[unit] = null;
    
    ctx.activeTexture(ctx.TEXTURE0 + unit);
    ctx.bindTexture(ctx.TEXTURE_2D, null);
  } else if (!boundTextures[unit] || boundTextures[unit].id !== finalTexture.id) {
    boundTextures[unit] = finalTexture;
    
    ctx.activeTexture(ctx.TEXTURE0 + unit);
    ctx.bindTexture(ctx.TEXTURE_2D, finalTexture.id);
  } 
}

function bindWhiteTexture(unit) {
  var texture = textureStore["\\1"];
  boundTextures[unit] = texture;
  
  ctx.activeTexture(ctx.TEXTURE0 + unit);
  ctx.bindTexture(ctx.TEXTURE_2D, texture.id);
}

function createRect(x, y, z, hw, hh, stscale) {
  return new Rect(x, y, z, hw, hh, stscale);
}

function createCube(x1, y1, z1, x2, y2, z2) {
  return new Cube(x1, y1, z1, x2, y2, z2);
}

function createSphere(x, y, z, latitudeBands, longitudeBands, radius) {
  return new Sphere(x, y, z, latitudeBands, longitudeBands, radius);
}

function createCylinder(x, y, z, r, h, bands) {
  return new Cylinder(x, y, z, r, h, bands);
}

function registerTextureHandler(fileType, textureHandler) {
  textureHandlers[fileType] = textureHandler;
}