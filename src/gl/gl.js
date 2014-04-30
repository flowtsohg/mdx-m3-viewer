function viewSize(width, height) {
  gl["viewport"](0, 0, width, height);
}

function setPerspective(fovy, aspect, near, far) {
  math.mat4.makePerspective(projectionMatrix, fovy, aspect, near, far);
}

function setOrtho(left, right, bottom, top, near, far) {
  math.mat4.makeOrtho(projectionMatrix, left, right, bottom, top, near, far);
}

function setBackground(red, green, blue) {
  gl["clearColor"](red, green, blue, 1);
}

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

function newShaderUnit(source, type, name) {
  var hash = String.hashCode(source);
  
  if (!shaderUnitStore[hash]) {
    shaderUnitStore[hash] = new ShaderUnit(source, type, name);
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
    
    var vertexUnit = newShaderUnit(defines + vertexSource, gl["VERTEX_SHADER"], name);
    var fragmentUnit = newShaderUnit(floatPrecision + defines + fragmentSource, gl["FRAGMENT_SHADER"], name);
    
    if (vertexUnit.ready && fragmentUnit.ready) {
      shaderStore[name] = new Shader(name, vertexUnit, fragmentUnit);
      shaderUniformStore[name] = {};
    }
  }
  
  if (!shaderStore[name] || !shaderStore[name].ready) {
    return false;
  }
  
  return shaderStore[name];
}

function shaderReady(name) {
  return shaderStore[name] && shaderStore[name].ready;
}

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
  
  return boundShader;
}

function setParameter(name, value) {
  if (boundShader) {
    var oldValue = shaderUniformStore[boundShaderName][name];
    var shouldSet = false;
    
    if (oldValue) {
      var isArray = value instanceof Array;
      
      if (isArray) {
        // This is inheretly bad, because if the same (albeit modified) array is given, then value===oldValue, and the uniform will never be updated, because of by-ref storage.
        //if (!Array.equals(oldValue, value)) {
          shouldSet = true;
        //}
      } else if (oldValue !== value) {
        shouldSet = true;
      }
    } else {
      shouldSet = true;
    }
    
    if (shouldSet) {
      shaderUniformStore[boundShaderName][name] = value;
      
      boundShader.setParameter(name, value);
    }
  }
}

function drawArraysInstanced(mode, first, count, primcount) {
  if (boundShader) {
    instancedArrays["drawArraysInstancedANGLE"](mode, first, count, primcount);
  }
}

function drawElementsInstanced(mode, count, type, indices, primcount) {
  if (boundShader) {
    instancedArrays["drawElementsInstancedANGLE"](mode, count, type, indices, primcount);
  }
}

var blarg = true;

function vertexAttribPointer(name, size, type, normalized, stride, pointer) {
  gl["vertexAttribPointer"](boundShader.attribs[name][0], size, type, normalized, stride, pointer);
}

function vertexAttribDivisor(name, divisor) {
  if (boundShader) {
    instancedArrays["vertexAttribDivisorANGLE"](boundShader.getParameter(name)[0], divisor);
  }
}


function bindMVP(uniform) {
  if (boundShader) {
    math.mat4.multMat(projectionMatrix, viewMatrix, mvpMatrix);
    
    boundShader.setParameter(uniform, mvpMatrix);
  }
}

function getMVP() {
  math.mat4.multMat(projectionMatrix, viewMatrix, mvpMatrix);
  
  return mvpMatrix;
}

function bindProjection(uniform) {
  if (boundShader) {
    boundShader.setParameter(uniform, projectionMatrix);
  }
}

function getProjection() {
  return projectionMatrix;
}

function bindView(uniform) {
  if (boundShader) {
    boundShader.setParameter(uniform, viewMatrix);
  }
}

function getView() {
  return viewMatrix;
}

function newTexture(source) {
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
    
    gl["activeTexture"](gl["TEXTURE" + unit]);
    gl["bindTexture"](gl["TEXTURE_2D"], null);
  } else if (!boundTextures[unit] || boundTextures[unit].source !== finalTexture.source) {
    boundTextures[unit] = finalTexture;
    
    gl["activeTexture"](gl["TEXTURE" + unit]);
    gl["bindTexture"](gl["TEXTURE_2D"], finalTexture.id);
  } 
}

function newRect(x, y, z, hw, hh, stscale) {
  return new Rect(x, y, z, hw, hh, stscale);
}

function newCube(x1, y1, z1, x2, y2, z2) {
  return new Cube(x1, y1, z1, x2, y2, z2);
}

function newSphere(x, y, z, latitudeBands, longitudeBands, radius) {
  return new Sphere(x, y, z, latitudeBands, longitudeBands, radius);
}

function newCylinder(x, y, z, r, h, bands) {
  return new Cylinder(x, y, z, r, h, bands);
}