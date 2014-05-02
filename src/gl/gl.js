function setPerspective(fovy, aspect, near, far) {
  math.mat4.makePerspective(projectionMatrix, fovy, aspect, near, far);
  refreshViewProjectionMatrix = true;
}

function setOrtho(left, right, bottom, top, near, far) {
  math.mat4.makeOrtho(projectionMatrix, left, right, bottom, top, near, far);
  refreshViewProjectionMatrix = true;
}

function loadIdentity() {
  math.mat4.makeIdentity(viewMatrix);
  refreshViewProjectionMatrix = true;
}

function translate(x, y, z) {
  math.mat4.translate(viewMatrix, x, y, z);
  refreshViewProjectionMatrix = true;
}

function rotate(anctxe, x, y, z) {
  math.mat4.rotate(viewMatrix, anctxe, x, y, z);
  refreshViewProjectionMatrix = true;
}

function scale(x, y, z) {
  math.mat4.scale(viewMatrix, x, y, z);
  refreshViewProjectionMatrix = true;
}

function lookAt(eye, center, up) {
  math.mat4.makeLookAt(viewMatrix, eye, center, up);
  refreshViewProjectionMatrix = true;
}

function multMat(mat) {
  math.mat4.multMat(viewMatrix, mat, viewMatrix);
  refreshViewProjectionMatrix = true;
}

function pushMatrix() {
  matrixStack.push(Object.copy(viewMatrix));
  refreshViewProjectionMatrix = true;
}

function popMatrix() {
  viewMatrix = matrixStack.pop();
  refreshViewProjectionMatrix = true;
}

function getViewProjectionMatrix() {
  if (refreshViewProjectionMatrix) {
    math.mat4.multMat(projectionMatrix, viewMatrix, viewProjectionMatrix);
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
    
    var vertexUnit = createShaderUnit(defines + vertexSource, ctx["VERTEX_SHADER"], name);
    var fragmentUnit = createShaderUnit(floatPrecision + defines + fragmentSource, ctx["FRAGMENT_SHADER"], name);
    
    if (vertexUnit.ready && fragmentUnit.ready) {
      shaderStore[name] = new Shader(name, vertexUnit, fragmentUnit);
    }
  }
  
  if (shaderStore[name] && shaderStore[name].ready) {
    return shaderStore[name];
  }
}

function shaderReady(name) {
  return shaderStore[name] && shaderStore[name].ready;
}

function enableVertexAttribs(start, end) {
  for (var i = start; i < end; i++) {
    ctx["enableVertexAttribArray"](i);
  }
}

function disableVertexAttribs(start, end) {
  for (var i = start; i < end; i++) {
    ctx["disableVertexAttribArray"](i);
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
    
    ctx["useProgram"](shader.id);
    
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

function loadTexture(source) {
  if (!textureStore[source]) {
    var ext = getFileExtension(source).toLowerCase();
    
    onloadstart({isTexture: 1, source: source});
    
    if (ext === "dds") {
      textureStore[source] = new DDSTexture(source, onload, onerror, onprogress);
    } else if (ext === "blp") {
      textureStore[source] = new BLPTexture(source, onload, onerror, onprogress);
    } else {
      textureStore[source] = new Texture(source, onload, onerror, onprogress);
    }
  }
  
  return textureStore[source];
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
    
    ctx["activeTexture"](ctx["TEXTURE0"] + unit);
    ctx["bindTexture"](ctx["TEXTURE_2D"], null);
  } else if (!boundTextures[unit] || boundTextures[unit].id !== finalTexture.id) {
    boundTextures[unit] = finalTexture;
    
    ctx["activeTexture"](ctx["TEXTURE0"] + unit);
    ctx["bindTexture"](ctx["TEXTURE_2D"], finalTexture.id);
  } 
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