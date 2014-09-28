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
      instanceArray[i].renderColor(context);
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
      
      idFactory += 1;
      object = new AsyncModel(source, idFactory, textureMap);
      
      modelMap[source] = object;
      modelArray.push(object);
      modelInstanceMap[idFactory] = object;
      
      onloadstart(object);
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
    
    onunload(instance);
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
    
    onunload(model);
  }
  
  // ---------------------
  // Model loading API
  // ---------------------
  
  /**
    * Loads a resource.
    *
    * @memberof ModelViewer
    * @instance
    * @param {string} source The source to load from. Can be an absolute url, a path to a file in the MPQ files of Warcraft 3 and Starcraft 2, or a form of identifier to be used for headers.
    */
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
  
  /**
    * Unloads a resource.
    *
    * @memberof ModelViewer
    * @instance
    * @param {(string|number)} source The source to unload from. Can be the source of a previously loaded resource, or a valid model or instance ID.
    */
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
  
  /**
    * Sets the visiblity of a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @param {boolean} mode The visibility mode.
    */
  function setVisibility(objectId, mode) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.setVisibility(mode);
    }
  }
  
  /**
    * Gets the visiblity of a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @returns {boolean} The visibility mode.
    */
  function getVisibility(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getVisibility();
    }
  }
  
  /**
    * Sets the visiblity of a model instance's mesh.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @param {number} meshId The ID of the mesh.
    * @param {boolean} mode The visibility mode.
    */
  function setMeshVisibility(objectId, meshId, mode) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.setMeshVisibility(meshId, mode);
    }
  }
  
  /**
    * Gets the visiblity of a model instance's mesh.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @param {number} meshId The ID of the mesh.
    * @return {boolean} The visibility mode.
    */
  function getMeshVisibility(objectId, meshId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getMeshVisibility(meshId);
    }
  }
  
  // ------------------
  // Transform API
  // ------------------
  
  /**
    * Sets the location of a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @param {vec3} v The location.
    */
  function setLocation(objectId, v) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.setLocation(v);
    }
  }
  
  /**
    * Moves a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @param {vec3} v The displacement.
    */
  function move(objectId, v) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.move(v);
    }
  }
  
  /**
    * Gets the location of a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @returns {vec3} The location.
    */
  function getLocation(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getLocation();
    }
  }
  
  /**
    * Sets the rotation of a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @param {vec3} v A vector of euler angles.
    */
  function setRotation(objectId, v) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.setRotation(v);
    }
  }
  
  /**
    * Rotates a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @param {vec3} v A vector of euler angles.
    */
  function rotate(objectId, v) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.rotate(v);
    }
  }
  
  /**
    * Gets the rotation of a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @returns {vec3} A vector of euler angles.
    */
  function getRotation(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getRotation();
    }
  }
  
  /**
    * Sets the rotation of a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @param {quat} v A quaternion.
    */
  function setRotationQuat(objectId, q) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.setRotationQuat(quat.normalize(q, q));
    }
  }
  
  /**
    * Rotates a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @param {quat} v A quaternion.
    */
  function rotateQuat(objectId, q) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.rotate(quat.normalize(q, q));
    }
  }
  
  /**
    * Gets the rotation of a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @returns {quat} A quaternion.
    */
  function getRotationQuat(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getRotationQuat();
    }
  }
  
  /**
    * Sets the scale of a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @param {number} n The scale factor.
    */
  function setScale(objectId, n) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.setScale(n);
    }
  }
  
  /**
    * Scales a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @param {number} n The scale factor.
    */
  function scale(objectId, n) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.scale(n);
    }
  }
  
  /**
    * Gets the scale of a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @returns {number} The scale factor.
    */
  function getScale(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getScale();
    }
  }
  
  /**
    * Sets the parent of a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @param {number} parentId The ID of the parent model instance.
    * @param {number} [attachmentId] The ID of an attachment owned by the parent.
    */
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
  
  /**
    * Gets the parent of a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @returns {array} The parent and attachment IDs as an array.
    */
  function getParent(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getParent();
    }
  }
  
  // -----------------------------
  // Team colors and textures
  // -----------------------------
  
  /**
    * Sets the team color of a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @param {number} teamID The team color.
    */
  function setTeamColor(objectId, teamId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.setTeamColor(teamId);
    }
  }
  
  /**
    * Gets the team color of a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @returns {number} The team color.
    */
  function getTeamColor(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getTeamColor();
    }
  }
  
  /**
    * Overrides a texture of a model or model instance.
    * If overriding the texture of a model, it will affect all of its instances who don't explicitly override this texture too.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model or a model instance.
    * @param {string} path The texture path that gets overriden.
    * @paran {string} override The new absolute path that will be used.
    */
  function overrideTexture(objectId, path, override) {
    var object = modelInstanceMap[objectId];
    
    if (object) {
      object.overrideTexture(path, override);
    }
  }
  
  /**
    * Gets the texture map of a model or a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model or a model instance.
    * @returns {object} The texture map.
    */
  function getTextureMap(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object) {
      return object.getTextureMap();
    }
  }
  
  // ------------
  // Sequences
  // ------------
  
  /**
    * Sets the sequence of a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @param {number} sequenceId The sequence.
    */
  function setSequence(objectId, sequenceId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.setSequence(sequenceId);
    }
  }
  
  /**
    * Stops the sequence of a model instance.
    * Equivalent to setSequence(objectId, -1).
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    */
  function stopSequence(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.setSequence(-1);
    }
  }
  
  /**
    * Gets the sequence of a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @returns {number} The sequence.
    */
  function getSequence(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getSequence();
    }
  }
  
  /**
    * Sets the sequence loop mode of a model instance.
    * Possible values are 0 for default, 1 for never loop, and 2 for always loop.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @param {number} mode The loop mode.
    */
  function setSequenceLoopMode(objectId, mode) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      object.setSequenceLoopMode(mode);
    }
  }
  
  /**
    * Gets the sequence loop mode of a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @returns {number} sequenceId The loop mode.
    */
  function getSequenceLoopMode(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isInstance) {
      return object.getSequenceLoopMode();
    }
  }
  
  // ----------
  // Getters
  // ----------
  
  /**
    * Gets all the information of a model or a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model or a model instance.
    * @returns {object} The information.
    */
  function getInfo(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object) {
      return object.getInfo();
    }
  }
  
  /**
    * Gets a model ID from a valid source or model instance ID.
    *
    * @memberof ModelViewer
    * @instance
    * @param {string} source The source.
    * @returns {number} The model ID.
    */
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
  
  /**
    * Gets the source of a model or a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model or a model instance.
    * @returns {number} The source.
    */
  function getSource(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object) {
      return object.getSource();
    }
  }
  
  /**
    * Gets the sequence list of a model or a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model or a model instance.
    * @returns {number} The list.
    */
  function getSequences(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object) {
      return object.getSequences();
    }
  }
  
  /**
    * Gets the attachment list of a model or a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model or a model instance.
    * @returns {number} The list.
    */
  function getAttachments(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object) {
      return object.getAttachments();
    }
  }
  
  /**
    * Gets the camera list of a model or a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model or a model instance.
    * @returns {number} The list.
    */
  function getCameras(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object) {
      return object.getCameras();
    }
  }
  
  /**
    * Gets the bounding shape list of a model or a model instance.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model or a model instance.
    * @returns {number} The list.
    */
  function getBoundingShapes(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object) {
      return object.getBoundingShapes();
    }
  }
  
  /**
    * Gets the number of meshes a model or a model instance owns.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model or a model instance.
    * @returns {number} The number of meshes.
    */
  function getMeshCount(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object) {
      return object.getMeshCount();
    }
  }
  
  /**
    * Gets a list of all model instances that a model owns.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model.
    * @returns {number} The list.
    */
  function getInstances(objectId) {
    var object = modelInstanceMap[objectId];
    
    if (object && object.isModel) {
      return object.getInstances();
    }
  }
  
  // -------------------
  // General settings
  // -------------------
  
  /**
    * Sets the animation speed.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} ratio The speed.
    */
  function setAnimationSpeed(ratio) {
    context.frameTime = ratio / 60 * 1000;
  }
  
  /**
    * Gets the animation speed.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {number} The speed.
    */
  function getAnimationSpeed() {
    return context.frameTime / 1000 * 60;
  }
  
  /**
    * Sets the world mode.
    * Possible values are 0 for nothing, 1 for sky, 2 for sky and ground, and 3 for sky and water.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} mode The world mode.
    */
  function setWorldMode(mode) {
    context.worldMode = mode;
  }
  
  /**
    * Gets the world mode.
    * Possible values are 0 for nothing, 1 for sky, 2 for sky and ground, and 3 for sky and water.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} The world mode.
    */
  function getWorldMode() {
    return context.worldMode;
  }
  
  /**
    * Sets the ground size.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} size The ground size.
    */
  function setGroundSize(size) {
    size /= 2;
    
    context.groundSize = size;
    
    grass_water.resize(size, size);
    bedrock.resize(size, size);
  }
  
  /**
    * Gets the ground size.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {number} The ground size.
    */
  function getGroundSize() {
    return context.groundSize * 2;
  }
  
  /**
    * Sets the mesh mode. If false, no meshes will be shown.
    *
    * @memberof ModelViewer
    * @instance
    * @param {boolean} mode The mode.
    */
  function setMeshesMode(mode) {
    context.meshesMode = mode;
  }
  
  /**
    * Gets the mesh mode.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {boolean} The mode.
    */
  function getMeshesMode() {
    return context.meshesMode;
  }
  
  /**
    * Sets the particle emitters mode. If false, no particle emitters will be shown.
    *
    * @memberof ModelViewer
    * @instance
    * @param {boolean} mode The mode.
    */
  function setEmittersMode(b) {
    context.emittersMode = b;
  }
  
  /**
    * Gets the particle emitters mode.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {boolean} The mode.
    */
  function getEmittersMode() {
    return context.emittersMode;
  }
  
  /**
    * Sets the bounding shapes mode. If false, no bounding shapes will be shown.
    *
    * @memberof ModelViewer
    * @instance
    * @param {boolean} mode The mode.
    */
  function setBoundingShapesMode(b) {
    context.boundingShapesMode = b;
  }
  
  /**
    * Gets the bounding shapes mode.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {boolean} The mode.
    */
  function getBoundingShapesMode() {
    return context.boundingShapesMode;
  }
  
  /**
    * Sets the team colors mode. If false, no team colors will be shown.
    *
    * @memberof ModelViewer
    * @instance
    * @param {boolean} mode The mode.
    */
  function setTeamColorsMode(b) {
    context.teamColorsMode = b;
  }
  
  /**
    * Gets the team colors mode.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {boolean} The mode.
    */
  function getTeamColorsMode() {
    return context.teamColorsMode;
  }
  
  /**
    * Sets the polygon mode. If false, models will render as wireframe.
    *
    * @memberof ModelViewer
    * @instance
    * @param {boolean} mode The mode.
    */
  function setPolygonMode(b) {
    context.polygonMode = b;
  }
  
  /**
    * Gets the polygon mode.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {boolean} The mode.
    */
  function getPolygonMode() {
    return context.polygonMode;
  }
  
  /**
    * Sets the shader.
    * Possible values are 0 for `standard`, 1 for `diffuse`, 2 for `normals`, 3 for `uvs`, 4 for `normal map`, 5 for `specular map`, 6 for `specular map + normal map`, 7 for `emissive`, 8 for `unshaded`, 9 for `unshaded + normal map`, 10 for `decal`, and finally 11 for `white`.
    * Note: only the normals, uvs, and white shaders affect Warcraft 3 models, the rest only affect Starcraft 2 models.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} id The shader.
    */
  function setShader(id) {
    context.shader = id;
  }
  
  /**
    * Gets the shader.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {number} The shader.
    */
  function getShader() {
    return context.shader;
  }
  
  // -------------------
  // Camera settings
  // -------------------
  
  /**
    * Sets the camera.
    * If either of the arguments is -1, the normal free form camera is used.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} objectId The ID of a model instance.
    * @param {number} cameraId The camera.
    */
  function setCamera(objectId, cameraId) {
    context.instanceCamera[0] = objectId;
    context.instanceCamera[1] = cameraId;
  }
  
  /**
    * Gets the camera.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {array} The model instance ID and camera. If the free form camera is used, both will be -1.
    */
  function getCamera() {
    return [context.instanceCamera[0], context.instanceCamera[1]];
  }
  
  /**
    * Pans the camera on the x and y axes.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} x Amount to pan on the X axis.
    * @param {number} y Amount to pan on the Y axis.
    */
  function panCamera(x, y) {
    context.instanceCamera[1] = -1;
    context.camera[0][0] += x;
    context.camera[0][1] -= y;
  }
  
  /**
    * Rotates the camera on the x and y axes.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} x Amount to rotate on the X axis.
    * @param {number} y Amount to rotate on the Y axis.
    */
  function rotateCamera(x, y) {
    context.instanceCamera[1] = -1;
    context.camera[1][0] += math.toRad(x);
    context.camera[1][1] += math.toRad(y);
  }
  
  /**
    * Zooms the camera by a factor.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} n Zoom factor.
    */
  function zoomCamera(n) {
    context.instanceCamera[1] = -1;
    context.camera[0][2] = Math.floor(context.camera[0][2] * n);
  }
  
  /**
    * Resets the camera to the initial state.
    *
    * @memberof ModelViewer
    * @instance
    */
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
  
  /**
    * Selects a model instance given a screen-space position.
    *
    * @memberof ModelViewer
    * @instance
    * @param {number} x X coordinate.
    * @param {number} y Y coordinate.
    * @returns {number} The ID of the selected model instance, or -1 if no model instance was selected.
    */
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
  
  /**
    * Saves the scene as a JSON string.
    *
    * @memberof ModelViewer
    * @instance
    * @returns {string} The JSON string.
    */
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
  
  /**
    * Loads a scene from JSON string.
    *
    * @memberof ModelViewer
    * @instance
    * @param {string} scene The JSON string.
    */
  function loadScene(scene) {
    var i,
          l,
          idMap = [], // Map from object IDs in the scene to actual indices in the object array.
          id,
          models,
          instances,
          object,
          owningModel,
          instance;
    
    scene = JSON.parse(scene);
    
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
  
  /**
    * Registers external handlers for an unspported model type.
    *
    * @memberof ModelViewer
    * @instance
    * @param {string} fileType The file format the handlers handle.
    * @param {BaseModel} modelHandler A BaseModel-like object.
    * @param {BaseModelInstance} modelInstanceHandler A BaseModelInstance-like object.
    * @param {boolean} binary Determines what type of input the model handler will get - a string, or an ArrayBuffer.
    */
  function registerModelHandler(fileType, modelHandler, modelInstanceHandler, binary) {
    AsyncModel.handlers[fileType] = [modelHandler, binary];
    AsyncModelInstance.handlers[fileType] = modelInstanceHandler;
    
    supportedModelFileTypes[fileType] = 1;
    supportedFileTypes[fileType] = 1;
  }
  
  /**
    * Registers an external handler for an unsupported texture type.
    *
    * @memberof ModelViewer
    * @instance
    * @param {string} fileType The file format the handler handles.
    * @param {function} textureHandler
    */
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