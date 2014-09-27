function setupColor(width, height) {
    // Color texture
    var color = ctx.createTexture();
    ctx.bindTexture(ctx.TEXTURE_2D, color);
    gl.textureOptions(ctx.REPEAT, ctx.REPEAT, ctx.NEAREST, ctx.NEAREST);
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, width, height, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, null);
    
    // Depth render buffer
    var depth = ctx.createRenderbuffer();
    ctx.bindRenderbuffer(ctx.RENDERBUFFER, depth);
    ctx.renderbufferStorage(ctx.RENDERBUFFER, ctx.DEPTH_COMPONENT16, width, height);
    
    // FBO
    var fbo = ctx.createFramebuffer();
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, fbo);
    ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, color, 0);
    ctx.framebufferRenderbuffer(ctx.FRAMEBUFFER, ctx.DEPTH_ATTACHMENT, ctx.RENDERBUFFER, depth);
  
    ctx.bindTexture(ctx.TEXTURE_2D, null);
    ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
    
    return fbo;
  }
  
  // Used for color picking
  //var colorFBO = setupColor(512, 512);
  
  function resetViewport() {
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    ctx.viewport(0, 0, width, height);
    gl.setPerspective(45, width / height, 0.1, 5E4);
  }
  
  resetViewport();
  
  addEvent(window, "resize", resetViewport);
  
  // Used by Mdx.ParticleEmitter since they don't need to be automatically updated and rendered
  function loadInternalModelInstance(source) {
    if (!modelMap[source]) {
      modelMap[source] = new AsyncModel(source);
    }
    
    var instance = new AsyncModelInstance(modelMap[source]);
    
    // Avoid reporting this instance since it's internal
    instance.delayOnload = true;
    
    return instance;
  }
  
  resetCamera();
  
  var number;
  
  for (var i = 0; i < 13; i++) {
    number = ((i < 10) ? "0" + i : i);
    
    gl.loadTexture(urls.mpqFile("ReplaceableTextures/TeamColor/TeamColor" + number + ".blp"));
    gl.loadTexture(urls.mpqFile("ReplaceableTextures/TeamGlow/TeamGlow" + number + ".blp"));
  }
      
  gl.createShader("world", SHADERS.vsworld, SHADERS.psworld);
  gl.createShader("white", SHADERS.vswhite, SHADERS.pswhite);
  
  gl.loadTexture(grassPath);
  gl.loadTexture(waterPath);
  gl.loadTexture(bedrockPath);
  gl.loadTexture(skyPath);
  
  grass_water = gl.createRect(0, 0, -3, context.groundSize, context.groundSize, 6);
  bedrock = gl.createRect(0, 0, -35, context.groundSize, context.groundSize, 6);
  sky = gl.createSphere(0, 0, 0, 5, 40, 2E3);
  
  function updateParticleRect() {
    for (var i = 0; i < 7; i++) {
      vec3.transformMat4(context.particleBillboardedRect[i], context.particleRect[i], inverseCameraRotation);
    }
  }
  
  function transformCamera() {
    mat4.identity(cameraMatrix);
    mat4.identity(inverseCameraRotation);
    
    if (context.instanceCamera[1] === -1) {
      var z = context.camera[1][1];
      var x = context.camera[1][0];

      mat4.translate(cameraMatrix, cameraMatrix, context.camera[0]);
      mat4.rotate(cameraMatrix, cameraMatrix, x, xAxis);
      mat4.rotate(cameraMatrix, cameraMatrix, z, zAxis);
      
      mat4.rotate(inverseCameraRotation, inverseCameraRotation, -z, zAxis);
      mat4.rotate(inverseCameraRotation, inverseCameraRotation, -x, xAxis);
      
      mat4.invert(inverseCamera, cameraMatrix);
      vec3.transformMat4(cameraPosition, zAxis, inverseCamera);
    } else {
      var instance = modelInstanceMap[context.instanceCamera[0]];
      
      if (instance) {
        var cam = instance.getCamera(context.instanceCamera[1]);
        
        if (cam) {
          var targetPosition = cam.targetPosition;
          
          mat4.lookAt(cameraMatrix, cam.position, targetPosition, upDir);
          mat4.toRotationMat4(inverseCameraRotation, cameraMatrix);
          
          cameraPosition[0] = targetPosition[0];
          cameraPosition[1] = targetPosition[1];
          cameraPosition[2] = targetPosition[2];
        }
      }
    }
    
    gl.loadIdentity();
    gl.multMat(cameraMatrix);
  }
  
  function update() {
    for (var i = 0, l = instanceArray.length; i < l; i++) {
      instanceArray[i].update(context);
    }
    
    transformCamera();
    
    updateParticleRect();
  }
  
  function renderGround(isWater) {
    if (context.worldMode > 1 && gl.shaderStatus("world")) {
      var shader = gl.bindShader("world");
      
      ctx.disable(ctx.CULL_FACE);
      
      ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
      
      if (isWater) {
        uvOffset[0] += uvSpeed[0];
        uvOffset[1] += uvSpeed[1];
        
        ctx.uniform2fv(shader.variables.u_uv_offset, uvOffset);
        ctx.uniform1f(shader.variables.u_a, 0.6);
      } else {
        ctx.uniform2fv(shader.variables.u_uv_offset, [0, 0]);
        ctx.uniform1f(shader.variables.u_a, 1);
      }
      
      if (context.worldMode > 2) {
        if (isWater) {
          ctx.enable(ctx.BLEND);
          ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
          
          gl.bindTexture(waterPath, 0);
          grass_water.render(shader);
          
          ctx.disable(ctx.BLEND);
        } else {
          gl.bindTexture(bedrockPath, 0);
          bedrock.render(shader);
        }
      } else {
        gl.bindTexture(grassPath, 0);
        grass_water.render(shader);
      }
    }
  }
  
  function renderSky() {
    if (context.worldMode > 0 && gl.shaderStatus("world")) {
      var shader = gl.bindShader("world");
      
      ctx.uniform2fv(shader.variables.u_uv_offset, [0, 0]);
      ctx.uniform1f(shader.variables.u_a, 1);
      ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getProjectionMatrix());
      
      gl.bindTexture(skyPath, 0);
      sky.render(shader);
    }
  }
  
  function render() {
    var i,
          l = instanceArray.length;
    
    ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
    
    renderSky();
    renderGround();
    
    // Render geometry
    if (context.meshesMode) {
      for (i = 0; i < l; i++) {
        instanceArray[i].render(context);
      }
    }
    
    // Render particles
    if (context.emittersMode) {
      for (i = 0; i < l; i++) {
        instanceArray[i].renderEmitters(context);
      }
    }
    
    // Render bounding shapes
    if (context.boundingShapesMode) {
      for (i = 0; i < l; i++) {
        instanceArray[i].renderBoundingShapes(context);
      }
    }
    
    if (context.worldMode > 2) {
      renderGround(true);
    }
  }
  
  function renderColor() {
    ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
    
    ctx.disable(ctx.CULL_FACE);
    
    for (var i = 0, l = instanceArray.length; i < l; i++) {
      instanceArray[i].renderColor();
    }
    
    ctx.enable(ctx.CULL_FACE);
  }
  
  // The main loop of the viewer
  function step() {
    update();
    render();
    
    requestAnimationFrame(step);
  }

  step();
  
  // Generate a unique color
  var generateColor = (function () {
    var index = 1;
    
    return function () {
      var a = index % 10;
      var b = Math.floor(index / 10) % 10;
      var c = Math.floor(index / 100) % 10;
      
      index += 1;
      
      return [a / 10, b / 10, c / 10];
    };
  }());
  
  function colorString(color) {
    var r = Math.floor(color[0] * 255);
    var g = Math.floor(color[1] * 255);
    var b = Math.floor(color[2] * 255);
    
    return "" + r + g + b;
  }
  
  function loadModel(source, textureMap) {
    if (!modelMap[source]) {
      var object;
      
      onloadstart({isModel: 1, source: source});
      
      idFactory += 1;
      object = new AsyncModel(source, idFactory, textureMap);
      
      modelMap[source] = object;
      modelArray.push(object);
      modelInstanceMap[idFactory] = object;
    }
    
    return modelMap[source];
  }
  
  function loadInstance(source, hidden) {
    var object,
          color = generateColor();
    
    idFactory += 1;
    object = new AsyncModelInstance(modelMap[source], idFactory, color);
    
    if (hidden) {
      object.setVisibility(false);
    }
    
    modelInstanceMap[idFactory] = object;
    instanceArray.push(object);
    instanceMap[colorString(color)] = object;
    
    if (object.delayOnload) {
      onload(object);
    }
    
    return object;
  }
  
  // Load a model or texture from an absolute url, with an optional texture map, and an optional hidden parameter
  function loadResourceImpl(source, textureMap, hidden) {
    var fileType = getFileExtension(source).toLowerCase();
    
    if (supportedModelFileTypes[fileType]) {
      loadModel(source, textureMap);
      loadInstance(source, hidden);
    } else {
      gl.loadTexture(source);
    }
  }
  
  function loadResourceFromId(e) {
    var status = e.target.status;
    
    if (status === 200) {
      onload(this);
      
      var i, l;
      var object = JSON.parse(e.target.responseText);
      var keys = Object.keys(object.textures);
      var textureMap = {};
      
      if (DEBUG_MODE) {
        console.log(object);
      }
      
      for (i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        var texture = object.textures[key];
        
        textureMap[key] = texture.url;
        
        gl.loadTexture(textureMap[key]);
      }
      
      var models = object.models;
      
      for (i = 0, l = object.models.length; i < l; i++) {
        loadResourceImpl(models[i].url, textureMap, models[i].hidden);
      }
    }
  }
  
  function unloadInstance(instance, unloadingModel) {
    var i,
          l,
          instances = instance.asyncModel.instances;
    
    // Remove from the instance array
    for (i = 0, l = instanceArray.length; i < l; i++) {
      if (instanceArray[i] === instance) {
        instanceArray.splice(i, 1);
      }
    }
    
    // Remove from the instance map
    delete instanceMap[colorString(instance.color)];
    
    // Remove from the model-instance map
    delete modelInstanceMap[instance.id];
    
    // Don't remove from the model if the model itself is unloaded
    if (!unloadingModel) {
      // Remove from the instances list of the owning model
      for (i = 0, l = instances.length; i < l; i++) {
        if (instances[i] === instance) {
          instances.splice(i, 1);
        }
      }
    }
  }
  
  function unloadModel(model) {
    var i,
          l,
          instances = model.instances;
    
    // Remove all instances owned by this model
    for (i = 0, l = instances.length; i < l; i++) {
      unloadInstance(instances[i], true);
    }
    
    // Remove from the model array
    for (i = 0, l = modelArray.length; i < l; i++) {
      if (modelArray[i] === model) {
        modelArray.splice(i, 1);
      }
    }
    
    // Remove from the model-instance map
    delete modelInstanceMap[model.id];
  }
  
  // ---------------------
  // Model loading API
  // ---------------------
  
  // Load a resource from a given source.
  // The source caan be an absolute path to a MDX/M3 file, a path to a MDX/M3 file in any of the Warcraft 3 and Starcraft 2 MPQs, or a resource thread ID used by the Hiveworkshop
  // If loading from a resource thread, every model and texture in the resource thread will be loaded.
  function loadResource(source) {
    var isSupported = supportedFileTypes[getFileExtension(source).toLowerCase()];
    
    if (source.startsWith("http://") && isSupported) {
      loadResourceImpl(source);
    } else if (isSupported) {
      loadResourceImpl(urls.mpqFile(source));
    } else {
      var object = {isHeader: 1, source: source};
      
      onloadstart(object);
      
      getFile(urls.header(source), false, loadResourceFromId.bind(object), onerror.bind(undefined, object), onprogress.bind(undefined, object));
    }
  }
  
  // Unload a resource from a given source.
  // If the source is a string, it can be the path of a loaded model, or a loaded texture.
  // If the source is a number, it must be a valid model or model instance ID.
  // If a model is removed, all of its instances are removed too.
  // Note: unloading a model or an instance that aren't loaded wont do anything.
  function unloadResource(source) {
    var object;
    
    if (typeof source === "number") {
      object = modelInstanceMap[source];
      
      if (object && object.ready) {
        if (object.isModel) {
          unloadModel(object);
        } else {
          unloadInstance(object);
        }
      }
    } else {
      object = modelMap[source];
      
      if (object) {
        if (object.ready) {
          unloadModel(object);
        }
      } else {
        gl.unloadTexture(source);
      }
    }
  }
  
  // ------------------
  // Instance visibility
  // ------------------
  
  // Shows or hides an instance.
  function setVisibility(objectId, b) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.setVisibility(b);
    }
  }
  
  // Get the visibility status if an instance.
  function getVisibility(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getVisibility();
    }
  }
  
  // Shows or hides a mesh of a specific instance.
  function setMeshVisibility(objectId, meshId, b) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.setMeshVisibility(meshId, b);
    }
  }
  
  // Get the visibility of a mesh in an instance.
  function getMeshVisibility(objectId, meshId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getMeshVisibility(meshId);
    }
  }
  
  // ------------------
  // Transform API
  // ------------------
  
  // Set the location of an instance.
  function setLocation(objectId, v) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.setLocation(v);
    }
  }
  
  // Move an instance.
  function move(objectId, v) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.move(v);
    }
  }
  
  // Get the location of an instance.
  function getLocation(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getLocation();
    }
  }
  
  // Set the rotation of an instance.
  function setRotation(objectId, v) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.setRotation(v);
    }
  }
  
  // Rotate an instance.
  function rotate(objectId, v) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.rotate(v);
    }
  }
  
  // Get the rotation of an instance.
  function getRotation(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getRotation();
    }
  }
  
  // Set the RotationQuat of an instance.
  function setRotationQuat(objectId, q) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.setRotationQuat(quat.normalize(q, q));
    }
  }
  
  // Rotate an instance.
  function rotateQuat(objectId, q) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.rotate(quat.normalize(q, q));
    }
  }
  
  // Get the RotationQuat of an instance.
  function getRotationQuat(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getRotationQuat();
    }
  }
  
  // Set the scale of an instance.
  function setScale(objectId, n) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.setScale(n);
    }
  }
  
  // Scale an instance.
  function scale(objectId, n) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.scale(n);
    }
  }
  
  // Get the scale of an instance.
  function getScale(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getScale();
    }
  }
  
  // Set the parent of an instance to another instance, with an optional attachment point owned by that parent.
  function setParent(objectId, parentId, attachmentId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      if (parentId === -1) {
        object.setParent();
      } else {
        var parent = modelInstanceMap[parentId];
        
        if (parent && parent.isInstance) {
          object.setParent(parent, attachmentId);
        }
      }
    }
  }
  
  // Get the parent of an instance as an array.
  // The first index is the parent ID, the second is the attachment ID.
  function getParent(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getParent();
    }
  }
  
  // -----------------------------
  // Team colors and textures
  // -----------------------------
  
  // Set the team color used by an instance.
  function setTeamColor(objectId, teamId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.setTeamColor(teamId);
    }
  }
  
  // Get the team color of an instance.
  function getTeamColor(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getTeamColor();
    }
  }
  
  // Override a texture of an instance or a model with another texture.
  // If objectId is an instance, overrides the texture locally just for that instance.
  // If objectId is a model, it overrides the texture for the model, which affects all instances that don't explicitly override this texture.
  function overrideTexture(objectId, oldPath, newPath) {
    var object = modelInstanceMap[objectId];
    
    if (object) {
      object.overrideTexture(oldPath, newPath);
    }
  }
  
  // Get the texture map of an instance or model.
  function getTextureMap(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object) {
      return object.getTextureMap();
    }
  }
  
  // ------------
  // Sequences
  // ------------
  
  // Set the sequence of an instance.
  function setSequence(objectId, sequenceId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.setSequence(sequenceId);
    }
  }
  
  // Stop the sequence of an instance.
  // Equivalent to setSequence with sequence ID -1.
  function stopSequence(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.setSequence(-1);
    }
  }
  
  // Get the current sequence of an instance.
  function getSequence(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getSequence();
    }
  }
  
  // Sets the sequence loop mode of an instance.
  // Possible values are 0 for default, 1 for never, and 2 for always.
  function setSequenceLoopMode(objectId, mode) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.setSequenceLoopMode(mode);
    }
  }
  
  // Get the sequence loop mode of an instance.
  function getSequenceLoopMode(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getSequenceLoopMode();
    }
  }
  
  // ----------
  // Getters
  // ----------
  
  // Get all the information of an object.
  function getInfo(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object) {
      return object.getInfo();
    }
  }
  
  // Return the model ID that an instance or path points to.
  // Returns null if given a path that no model was loaded with.
  // Returns null if given an invalid object ID.
  // Returns source if it is a model object ID.
  function getModel(source) {
    var object;
    
    if (typeof source === "string") {
      object = modelMap[source];
    
      if (object) {
        return object.id;
      }
    } else {
      object = modelInstanceMap[source];
      
      if (object) {
        if (object.isInstance) {
          return object.asyncModel.id;
        }
        
        return source;
      }
    }
  }
  
  // Get the source an object was created with.
  // If the object is an instance, returns the source that made the model this instance points to.
  function getSource(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object) {
      return object.getSource();
    }
  }
  
  // Get a list of the sequences owned by an object.
  // Proxies to the owning model if the given object is an instance.
  // Returns null if the object ID is invalid, or if the model didn't finish loading.
  function getSequences(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object) {
      return object.getSequences();
    }
  }
  
  // Get a list of the attachment points owned by an object.
  // Proxies to the owning model if the given object is an instance.
  // Returns null if the object ID is invalid, or if the model didn't finish loading.
  function getAttachments(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object) {
      return object.getAttachments();
    }
  }
  
  // Get a list of the cameras owned by an object.
  // Proxies to the owning model if the given object is an instance.
  // Returns null if the object ID is invalid, or if the model didn't finish loading.
  function getCameras(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object) {
      return object.getCameras();
    }
  }
  
  // Get a list of the bounding shapes owned by an object.
  // Proxies to the owning model if the given object is an instance.
  // Returns null if the object ID is invalid, or if the model didn't finish loading.
  function getBoundingShapes(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object) {
      return object.getBoundingShapes();
    }
  }
  
  // Get the number of meshes an object has. Proxies to the owning model if the given object is an instance.
  function getMeshCount(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object) {
      return object.getMeshCount();
    }
  }
  
  // Get all the instances owned by a model.
  function getInstances(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isModel) {
      return object.getInstances();
    }
  }
  
  // -------------------
  // General settings
  // -------------------
  
  // Set the animation speed
  function setAnimationSpeed(ratio) {
    context.frameTime = ratio / 60 * 1000;
  }
  
  // Get the animation speed
  function getAnimationSpeed() {
    return context.frameTime / 1000 * 60;
  }
  
  // Set the drawn world.
  // Possible values are 0 for nothing, 1 for sky, 2 for sky and ground, and 3 for sky and water.
  function setWorldMode(mode) {
    context.worldMode = mode;
  }
  
  // Get the world mode.
  function getWorldMode() {
    return context.worldMode;
  }
  
  // Set the size of the ground
  function setGroundSize(size) {
    size /= 2;
    
    context.groundSize = size;
    
    grass_water.resize(size, size);
    bedrock.resize(size, size);
  }
  
  // Get the size of the ground
  function getGroundSize() {
    return context.groundSize * 2;
  }
  
  // Shows or hides all of the meshes
  function setMeshesMode(b) {
    context.meshesMode = b;
  }
  
  // Get the mesh render mode
  function getMeshesMode() {
    return context.meshesMode;
  }
  
  // Shows or hides all of the emitters
  function setEmittersMode(b) {
    context.emittersMode = b;
  }
  
  // Get the emitter render mode
  function getEmittersMode() {
    return context.emittersMode;
  }
  
  // Shows or hides the bounding shapes for all instances.
  function setBoundingShapesMode(b) {
    context.boundingShapesMode = b;
  }
  
  // Get the bounding shapes mode.
  function getBoundingShapesMode() {
    return context.boundingShapesMode;
  }
  
  // Shows or hides team colors for all instances.
  function setTeamColorsMode(b) {
    context.teamColorsMode = b;
  }
  
  // Get the team colors mode.
  function getTeamColorsMode() {
    return context.teamColorsMode;
  }
  
  // Set the render mode to either polygons or wireframe.
  // Pass true for polygons, or false for wireframe.
  function setPolygonMode(b) {
    context.polygonMode = b;
  }
  
  // Get the render mode
  function getPolygonMode() {
    return context.polygonMode;
  }
  
  // Set the shader to be used.
  // Possible values are 0 for `standard`, 1 for `diffuse`, 2 for `normals`, 3 for `uvs`, 4 for `normal map`, 5 for `specular map`, 6 for `specular map + normal map`, 7 for `emissive`, 8 for `unshaded`, 9 for `unshaded + normal map`, 10 for `decal`, and finally 11 for `white`.
  // Note: only the normals, uvs and white shaders affect Warcraft 3 models, the rest only affect Starcraft 2 models.
  function setShader(id) {
    context.shader = id;
  }
  
  // Get the shader used for Starcraft 2 models.
  function getShader() {
    return context.shader;
  }
  
  // -------------------
  // Camera settings
  // -------------------
  
  // Set the camera.
  // If either objectId or cameraId is equal to -1, then the free-form camera is used.
  function setCamera(objectId, cameraId) {
    context.instanceCamera[0] = objectId;
    context.instanceCamera[1] = cameraId;
  }
  
  // Get the camera.
  function getCamera() {
    return [context.instanceCamera[0], context.instanceCamera[1]];
  }
  
  // Pan the camera on the x and y axes.
  function panCamera(x, y) {
    context.instanceCamera[1] = -1;
    context.camera[0][0] += x;
    context.camera[0][1] -= y;
  }
  
  // Rotate the camera on the x and y axes.
  function rotateCamera(x, y) {
    context.instanceCamera[1] = -1;
    context.camera[1][0] += math.toRad(x);
    context.camera[1][1] += math.toRad(y);
  }
  
  // Zoom the camera by a factor.
  function zoomCamera(n) {
    context.instanceCamera[1] = -1;
    context.camera[0][2] = Math.floor(context.camera[0][2] * n);
  }
  
  // Reset the camera back to the initial state.
  function resetCamera() {
    context.instanceCamera[1] = -1;
    context.camera[0][0] = 0;
    context.camera[0][1] = 0;
    context.camera[0][2] = -300;
    context.camera[1] = [math.toRad(315), math.toRad(225)];
  }
  
  // ------
  // Misc
  // ------
  
  function selectInstance(x, y) {
    //var date = new Date();
    var pixel = new Uint8Array(4);
    
    //var dx = canvas.clientWidth / 512;
    //var dy = canvas.clientHeight / 512;
    
    //console.log(x, y);
    //x = Math.round(x / dx);
    //y = canvas.height - y;
    //y = Math.round(y / dy);
    //console.log(x, y);
    
    //ctx.bindFramebuffer(ctx.FRAMEBUFFER, colorFBO);
    
    //ctx.viewport(0, 0, 512, 512);
    //gl.setPerspective(45, 1, 0.1, 5E4);
    
    renderColor();
    
    // The Y axis of the WebGL viewport is inverted compared to screen space
    y = canvas.clientHeight - y;
    
    ctx.readPixels(x, y, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, pixel);
    
    //ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
    
    //ctx.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    //gl.setPerspective(45, canvas.clientWidth / canvas.clientHeight, 0.1, 5E4);
    
    //console.log(pixel);
    
    // WebGL sometimes rounds down and sometimes up, so this code takes care of that.
    // E.g.: 0.1*255 = 25.5, WebGL returns 25
    // E.g.: 0.5*255 = 127.5, WebGL returns 128
    var r = Math.floor(Math.round(pixel[0] / 25.5) * 25.5);
    var g = Math.floor(Math.round(pixel[1] / 25.5) * 25.5);
    var b = Math.floor(Math.round(pixel[2] / 25.5) * 25.5);
    
    var color = "" + r + g + b;
    var instance = instanceMap[color];
    
    //console.log("selectInstance", new Date() - date);
    
    if (instance) {
      return instance.id;
    }
    
    return -1;
  }
  
  // Save the scene as a JSON string.
  function saveScene() {
    var i, 
          l,
          models = [],
          instances = [],
          object;
    
    for (i = 0, l = modelArray.length; i < l; i++) {
      object = modelArray[i];
      
      if (object.ready) {
        models.push(object);
      }
    }
    
    for (i = 0, l = instanceArray.length; i < l; i++) {
      object = instanceArray[i];
      
      if (object.ready) {
        instances.push(object);
      }
    }
    
    return JSON.stringify([saveContext(), models, instances]);
  }
  
  // Load a scene from a JSON string.
  function loadScene(scene) {
    var i,
          l,
          idMap = [], // Map from object IDs in the scene to actual indices in the object array.
          id,
          models,
          instances,
          object,
          owningModel,
          model;
    
    scene = JSON.parse(scene);
    
    console.log(scene);
    loadContext(scene[0]);
    
    models = scene[1];
    instances = scene[2];
    
    // Load all the models
    for (i = 0, l = models.length; i < l; i++) {
      // object[0] = id
      // object[1] = source
      // object[2] = texture map
      object = models[i];
      
      loadModel(object[1], object[2]);
      
      idMap[object[0]] = idFactory;
    }
    
    // Load all the instances
    for (i = 0, l = instances.length; i < l; i++) {
      // object[0] = id
      // object[1] = model id
      // ...
      object = instances[i];
      
      owningModel = modelInstanceMap[idMap[object[1]]];
      
      instance = loadInstance(owningModel.getSource());
      instance.fromJSON(object);
      
      idMap[object[0]] = idFactory;
    }
    
    // The parenting must be applied after all instances are loaded
    for (i = 0, l = instances.length; i < l; i++) {
      // object[0] = id
      // object[8] = parent
      object = instances[i];
      parent = object[8];
      
      setParent(idMap[object[0]], idMap[parent[0]], parent[1]);
    }
  }
  
  function registerModelHandler(fileType, modelHandler, modelInstanceHandler, binary) {
    AsyncModel.handlers[fileType] = [modelHandler, binary];
    AsyncModelInstance.handlers[fileType] = modelInstanceHandler;
    
    supportedModelFileTypes[fileType] = 1;
    supportedFileTypes[fileType] = 1;
  }
  
  function registerTextureHandler(fileType, textureHandler) {
    gl.registerTextureHandler(fileType, textureHandler);
    
    supportedTextureFileTypes[fileType] = 1;
    supportedFileTypes[fileType] = 1;
  }
  
  return {
    // Resource API
    loadResource: loadResource,
    unloadResource: unloadResource,
    // Instance visibility
    setVisibility: setVisibility,
    getVisibility: getVisibility,
    setMeshVisibility: setMeshVisibility,
    getMeshVisibility: getMeshVisibility,
    // Transform API
    setLocation: setLocation,
    move: move,
    getLocation: getLocation,
    setRotation: setRotation,
    rotate: rotate,
    getRotation: getRotation,
    setRotationQuat: setRotationQuat,
    rotateQuat: rotateQuat,
    getRotationQuat: getRotationQuat,
    setScale: setScale,
    scale: scale,
    getScale: getScale,
    setParent: setParent,
    getParent: getParent,
    // Team colors and textures
    setTeamColor: setTeamColor,
    getTeamColor: getTeamColor,
    overrideTexture: overrideTexture,
    getTextureMap: getTextureMap,
    // Sequences
    setSequence: setSequence,
    stopSequence: stopSequence,
    getSequence: getSequence,
    setSequenceLoopMode: setSequenceLoopMode,
    // Information getters
    getInfo: getInfo,
    getModel: getModel,
    getSource: getSource,
    getSequences: getSequences,
    getAttachments: getAttachments,
    getCameras: getCameras,
    getBoundingShapes: getBoundingShapes,
    getMeshCount: getMeshCount,
    getInstances: getInstances,
    // General settings
    setAnimationSpeed: setAnimationSpeed,
    getAnimationSpeed: getAnimationSpeed,
    setWorldMode: setWorldMode,
    getWorldMode: getWorldMode,
    setGroundSize: setGroundSize,
    getGroundSize: getGroundSize,
    setMeshesMode: setMeshesMode,
    getMeshesMode: getMeshesMode,
    setEmittersMode: setEmittersMode,
    getEmittersMode: getEmittersMode,
    setBoundingShapesMode: setBoundingShapesMode,
    getBoundingShapesMode: getBoundingShapesMode,
    setTeamColorsMode: setTeamColorsMode,
    getTeamColorsMode: getTeamColorsMode,
    setPolygonMode: setPolygonMode,
    getPolygonMode: getPolygonMode,
    setShader: setShader,
    getShader: getShader,
    // Camera settings
    setCamera: setCamera,
    getCamera: getCamera,
    panCamera: panCamera,
    rotateCamera: rotateCamera,
    zoomCamera: zoomCamera,
    resetCamera: resetCamera,
    // Misc
    selectInstance: selectInstance,
    saveScene: saveScene,
    loadScene: loadScene,
    // Extending
    registerModelHandler: registerModelHandler,
    registerTextureHandler: registerTextureHandler
  };
};