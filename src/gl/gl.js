/**
 * Sets a perspective projection matrix.
 *
 * @memberof GL
 * @instance
 * @param {number} fovy
 * @param {number} aspect
 * @param {number} near
 * @param {number} far
 */
function setPerspective(fovy, aspect, near, far) {
  mat4.perspective(projectionMatrix, fovy, aspect, near, far);
  refreshViewProjectionMatrix = true;
}

/**
 * Sets an orthogonal projection matrix.
 *
 * @memberof GL
 * @instance
 * @param {number} left
 * @param {number} right
 * @param {number} bottom
 * @param {number} top
 * @param {number} near
 * @param {number} far
 */
function setOrtho(left, right, bottom, top, near, far) {
  mat4.ortho(projectionMatrix, left, right, bottom, top, near, far);
  refreshViewProjectionMatrix = true;
}

/**
 * Resets the view matrix.
 *
 * @memberof GL
 * @instance
 */
function loadIdentity() {
  mat4.identity(viewMatrix);
  refreshViewProjectionMatrix = true;
}

/**
 * Translates the view matrix.
 *
 * @memberof GL
 * @instance
 * @param {vec3} v Translation.
 */
function translate(v) {
  mat4.translate(viewMatrix, viewMatrix, v);
  refreshViewProjectionMatrix = true;
}

/**
 * Rotates the view matrix.
 *
 * @memberof GL
 * @instance
 * @param {number} radians Angle.
 * @param {vec3} axis The rotation axis..
 */
function rotate(radians, axis) {
  mat4.rotate(viewMatrix, viewMatrix, radians, axis);
  refreshViewProjectionMatrix = true;
}

/**
 * Scales the view matrix.
 *
 * @memberof GL
 * @instance
 * @param {vec3} v Scaling.
 */
function scale(v) {
  mat4.scale(viewMatrix, viewMatrix, v);
  refreshViewProjectionMatrix = true;
}

/**
 * Sets the view matrix to a look-at matrix.
 *
 * @memberof GL
 * @instance
 * @param {vec3} eye
 * @param {vec3} center
 * @param {vec3} up
 */
function lookAt(eye, center, up) {
  mat4.lookAt(viewMatrix, eye, center, up);
  refreshViewProjectionMatrix = true;
}

/**
 * Multiplies the view matrix by another matrix.
 *
 * @memberof GL
 * @instance
 * @param {mat4} mat.
 */
function multMat(mat) {
  mat4.multiply(viewMatrix, viewMatrix, mat);
  refreshViewProjectionMatrix = true;
}

/**
 * Pushes the current view matrix in the matrix stack.
 *
 * @memberof GL
 * @instance
 */
function pushMatrix() {
  matrixStack.push(mat4.clone(viewMatrix));
  refreshViewProjectionMatrix = true;
}

/**
 * Pops the matrix stacks and sets the popped matrix to the view matrix.
 *
 * @memberof GL
 * @instance
 */
function popMatrix() {
  viewMatrix = matrixStack.pop();
  refreshViewProjectionMatrix = true;
}

/**
 * Gets the view-projection matrix.
 *
 * @memberof GL
 * @instance
 * @returns {mat4} MVP.
 */
function getViewProjectionMatrix() {
  if (refreshViewProjectionMatrix) {
    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);
    refreshViewProjectionMatrix = false;
  }
  
  return viewProjectionMatrix;
}

/**
 * Gets the projection matrix.
 *
 * @memberof GL
 * @instance
 * @returns {mat4} P.
 */
function getProjectionMatrix() {
  return projectionMatrix;
}

/**
 * Gets the view matrix.
 *
 * @memberof GL
 * @instance
 * @returns {mat4} MV.
 */
function getViewMatrix() {
  return viewMatrix;
}

/**
 * Creates a new {@link GL.ShaderUnit}, or grabs it from the cache if it was previously created, and returns it.
 *
 * @memberof GL
 * @instance
 * @param {string} source GLSL source.
 * @param {number} type Shader unit type.
 * @param {string} name Owning shader's  name.
 * @returns {GL.ShaderUnit} The created shader unit.
 */
function createShaderUnit(source, type, name) {
  var hash = String.hashCode(source);
  
  if (!shaderUnitStore[hash]) {
    shaderUnitStore[hash] = new ShaderUnit(source, type, name);
  }
  
  return shaderUnitStore[hash];
}

/**
 * Creates a new {@link GL.Shader} program, or grabs it from the cache if it was previously created, and returns it.
 *
 * @memberof GL
 * @instance
 * @param {string} name The name of the shader.
 * @param {string} vertexSource Vertex shader GLSL source.
 * @param {string} fragmentSource Fragment shader GLSL source.
 * @param {array} defines An array of strings that will be added as #define-s to the shader source.
 * @returns {GL.Shader?} The created shader, or a previously cached version, or null if it failed to compile and link.
 */
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

/**
 * Checks if a shader is ready for use.
 *
 * @memberof GL
 * @instance
 * @param {string} name The name of the shader.
 * @returns {boolean} The shader's status.
 */
function shaderStatus(name) {
  var shader = shaderStore[name];
  
  return shader && shader.ready;
}

/**
 * Enables the WebGL vertex attribute arrays in the range defined by start-end.
 *
 * @memberof GL
 * @instance
 * @param {number} start The first attribute.
 * @param {number} end The last attribute.
 */
function enableVertexAttribs(start, end) {
  for (var i = start; i < end; i++) {
    ctx.enableVertexAttribArray(i);
  }
}

/**
 * Disables the WebGL vertex attribute arrays in the range defined by start-end.
 *
 * @memberof GL
 * @instance
 * @param {number} start The first attribute.
 * @param {number} end The last attribute.
 */
function disableVertexAttribs(start, end) {
  for (var i = start; i < end; i++) {
    ctx.disableVertexAttribArray(i);
  }
}

/**
 * Binds a shader. This automatically handles the vertex attribute arrays. Returns the currently bound shader.
 *
 * @memberof GL
 * @instance
 * @param {string} name The name of the shader.
 * @returns {GL.Shader} The bound shader.
 */
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

/**
 * Loads a texture, with optional options that will be sent to the texture's constructor,
 * If the texture was already loaded previously, it returns it.
 *
 * @memberof GL
 * @instance
 * @param {string} source The texture's url.
 * @param {object} options Options.
 * @returns {GL.Texture?} The bound shader.
 */
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

/**
 * Unloads a texture.
 *
 * @memberof GL
 * @instance
 * @param {string} source The texture's url.
 */
function unloadTexture(source) {
  if (textureStore[source]) {
    delete textureStore[source];
    
    onunload({isTexture: true, source: source});
  }
}

/**
 * Binds a texture to the specified texture unit.
 *
 * @memberof GL
 * @instance
 * @param {(string|GL.Texture)} object A texture source.
 * @param {number} [unit] The texture unit.
 */
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

/**
 * Creates a new {@link GL.Rect} and returns it.
 *
 * @memberof GL
 * @instance
 * @param {number} x X coordinate.
 * @param {number} y Y coordinate.
 * @param {number} z Z coordinate.
 * @param {number} hw Half of the width.
 * @param {number} hh Half of the height.
 * @param {number} stscale A scale that is applied to the texture coordinates.
 * @returns {GL.Rect} The rectangle.
 */
function createRect(x, y, z, hw, hh, stscale) {
  return new Rect(x, y, z, hw, hh, stscale);
}

/**
 * Creates a new {@link GL.Cube} and returns it.
 *
 * @memberof GL
 * @instance
 * @param {number} x1 Minimum X coordinate.
 * @param {number} y1 Minimum Y coordinate.
 * @param {number} z1 Minimum Z coordinate.
 * @param {number} x2 Maximum X coordinate.
 * @param {number} y2 Maximum Y coordinate.
 * @param {number} z2 Maximum Z coordinate.
 * @returns {GL.Cube} The cube.
 */
function createCube(x1, y1, z1, x2, y2, z2) {
  return new Cube(x1, y1, z1, x2, y2, z2);
}

/**
 * Creates a new {@link GL.Sphere} and returns it.
 *
 * @memberof GL
 * @instance
 * @param {number} x X coordinate.
 * @param {number} y Y coordinate.
 * @param {number} z Z coordinate.
 * @param {number} latitudeBands Latitude bands.
 * @param {number} longitudeBands Longitude bands.
 * @param {number} radius The sphere radius.
 * @returns {GL.Sphere} The sphere.
 */
function createSphere(x, y, z, latitudeBands, longitudeBands, radius) {
  return new Sphere(x, y, z, latitudeBands, longitudeBands, radius);
}

/**
 * Creates a new {@link GL.Cylinder} and returns it.
 *
 * @memberof GL
 * @instance
 * @param {number} x X coordinate.
 * @param {number} y Y coordinate.
 * @param {number} z Z coordinate.
 * @param {number} r The cylinder radius.
 * @param {number} h The cylinder height.
 * @param {number} bands Number of bands..
 * @returns {GL.Cylinder} The cylinder.
 */
function createCylinder(x, y, z, r, h, bands) {
  return new Cylinder(x, y, z, r, h, bands);
}

/**
 * Registers an external handler for an unsupported texture type.
 *
 * @memberof GL
 * @instance
 * @param {string} fileType The file format the handler handles.
 * @param {function} textureHandler
 */
function registerTextureHandler(fileType, textureHandler) {
  textureHandlers[fileType] = textureHandler;
}