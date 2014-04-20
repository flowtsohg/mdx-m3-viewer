  gl.setShaderMaps(PARAMETERMAP, MEMBERMAP);

  function resetViewport() {
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    gl.viewSize(width, height);
    gl.setPerspective(45, width / height, 0.1, 5E4);
  }
  
  resetViewport();
  
  addEvent(window, "resize", resetViewport);

  // Used by Mdx.ParticleEmitter since they don't need to be automatically updated and rendered
  function loadModelInstanceNoRender(source) {
    if (!modelCache[source]) {
      modelCache[source] = new Model(source);
    }
    
    return new ModelInstance(modelCache[source]);
  }
  
  camera.range = [30, 2000];
  resetCamera();
  
  for (var i = 0; i < 13; i++) {
    var number = ((i < 10) ? "0" + i : i);
    
    gl.newTexture(urls.mpqFile("ReplaceableTextures/TeamColor/TeamColor" + number + ".blp"));
    gl.newTexture(urls.mpqFile("ReplaceableTextures/TeamGlow/TeamGlow" + number + ".blp"));
  }
      
  gl.newShader("world", SHADERS["vsworld"], floatPrecision + SHADERS["psworld"]);
  gl.newShader("white", SHADERS["vswhite"], floatPrecision + SHADERS["pswhite"]);
  
  gl.newTexture("images/grass.png");
  gl.newTexture("images/water.png");
  gl.newTexture("images/bedrock.png");
  gl.newTexture("images/sky.png");
  //gl.newTexture("Light", "../images/Light.png");
    
  grass_water = gl.newRectangle(0, 0, -3, 250, 250, 6);
  bedrock = gl.newRectangle(0, 0, -35, 250, 250, 6);
  sky = gl.newSphere(0, 0, 0, 5, 10, 2E4);
  //light = gl.newSphere(0, 0, 0, 10, 10, 0.05);
  
  function update() {
    for (var i = 0, l = modelInstanceCache.length; i < l; i++) {
      if (modelInstanceCache[i].isInstance) {
        modelInstanceCache[i].update();
      }
    }
  }
  
  function transformCamera() {
    if (modelCameraId === -1) {
      var inverseCamera = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      var z = math.toRad(camera.r[1]);
      var x = math.toRad(camera.r[0]);

      math.mat4.translate(inverseCamera, camera.m[0], camera.m[1], -camera.m[2]);
      math.mat4.rotate(inverseCamera, x, 1, 0, 0);
      math.mat4.rotate(inverseCamera, z, 0, 0, 1);

      math.mat4.multVec3(inverseCamera, [0, 0, 1], cameraPosition);
      
      gl.loadIdentity();
      gl.multMat(inverseCamera);
    } else {
      cameraPosition = modelCamera.position;
      
      gl.lookAt(cameraPosition, modelCamera.targetPosition, upDir);
    }
  }
  
  function renderGround(isWater) {
    if (shouldRenderWorld > 1 && gl.shaderReady("world")) {
      gl.bindShader("world");
      
      ctx.disable(ctx.CULL_FACE);
      
      gl.bindMVP("u_mvp");
      
      if (isWater) {
        uvOffset[0] += uvSpeed[0];
        uvOffset[1] += uvSpeed[1];
        
        gl.setParameter("u_uv_offset", uvOffset);
        gl.setParameter("u_a", 0.6);
      } else {
        gl.setParameter("u_uv_offset", [0, 0]);
        gl.setParameter("u_a", 1);
      }
      
      if (shouldRenderWorld > 2) {
        if (isWater) {
          ctx.enable(ctx.BLEND);
          ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
          
          gl.bindTexture("images/water.png", 0);
          grass_water.render();
          
          ctx.disable(ctx.BLEND);
        } else {
          gl.bindTexture("images/bedrock.png", 0);
          bedrock.render();
        }
      } else {
        gl.bindTexture("images/grass.png", 0);
        grass_water.render();
      }
    }
  }
  
  function renderSky() {
    if (shouldRenderWorld > 0 && gl.shaderReady("world")) {
      gl.bindShader("world");
      
      gl.setParameter("u_uv_offset", [0, 0]);
      gl.setParameter("u_a", 1);
      
      gl.pushMatrix();
      gl.loadIdentity();
      
      gl.bindMVP("u_mvp");
      
      gl.bindTexture("images/sky.png", 0);
      sky.render();
      
      gl.popMatrix();
    }
  }

  /*
  function renderLights() {
    if (shouldRenderLights && worldShader) {
      gl.pushMatrix();
      
      gl.translate(lightPosition[0], lightPosition[1], lightPosition[2]);
      
      gl.bindShader("world");
      
      gl.bindMVP("u_mvp");
      
      gl.setParameter("u_diffuseMap", 0);
      gl.bindTexture("Light");
      
      light.render();
      
      gl.popMatrix();
    }
  }
  */
  function render() {
    transformCamera();
    renderSky();
    renderGround();
    //renderLights();
    
    for (var i = 0, l = modelInstanceCache.length; i < l; i++) {
      if (modelInstanceCache[i].isInstance) {
        modelInstanceCache[i].render(shouldRenderTeamColors);
      }
    }
    
    if (shouldRenderWorld > 2) {
      renderGround(true);
    }
  }
  
  // The main loop of the viewer
  
  var shouldRun = true;
  
  function run() {
    requestAnimationFrame(run);
    
    if (shouldRun) {
      update();
      render();
    }
  }

  run();
  
  function onVisibilityChange() {
    shouldRun = !isHidden();
  }
  
  addVisibilityListener(onVisibilityChange);
  
  function loadResourceImpl(source, textureMap) {
    var ext = getFileExtension(source);
    
    if (ext === "mdx" || ext === "m3") {
      var id;
      
      if (!modelCache[source]) {
        id = modelInstanceCache.length;
        
        var model = new Model(source, id, textureMap);
        
        modelCache[source] = model;
        
        modelInstanceCache.push(model);
      }
      
      id = modelInstanceCache.length;
      
      var instance = new ModelInstance(modelCache[source], id);
      
      modelInstanceCache.push(instance);
      
      if (instance.delayOnload) {
        onload(instance);
      }
    } else {
      gl.newTexture(source, source);
    }
  }
  
  function loadResourceFromId(e) {
    var status = e.target.status;
    
    if (status === 200) {
      var i, l;
      var object = JSON.parse(e.target.responseText);
      console.log(object);
      var keys = Object.keys(object.textures);
      var textureMap = {};
      
      for (i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        var texture = object.textures[key];
        
        if (key.endsWith("dds") && gl.hasCompressedTextures) {
          textureMap[key] = texture.url;
        } else {
          textureMap[key] = texture.url_png;
        }
        
        gl.newTexture(textureMap[key]);
      }
    
      for (i = 0, l = object.models.length; i < l; i++) {
        loadResourceImpl(object.models[i].url, textureMap);
      }
    }
  }
  
  // Load a model.
  // Source can be an absolute path to a MDX/M3 file, a path to a MDX/M3 file in any of the Warcraft 3 and Starcraft 2 MPQs, or a model ID used by the Hiveworkshop.
  // Returns the ID of the loaded model.
  // Note: if a model was already loaded from the given source, its ID will be returned.
  function loadModel(source, textureMap) {
    if (!modelCache[source]) {
      var id = modelInstanceCache.length;
      var model = new Model(source, id, textureMap);
      
      modelCache[source] = model;
      
      modelInstanceCache.push(model);
    }
    
    return modelCache[source].id;
  }
  
  // Create a new instance from an existing model or instance, or a path that will be used to load also the model if needed.
  // If source is a string, it can be an absolute path to a MDX/M3 file, a path to a MDX/M3 file in any of the Warcraft 3 and Starcraft 2 MPQs, or a model ID used by the Hiveworkshop.
  // If source is a number, it can be an ID of a model or an instance.
  // Returns null if given an invalid ID, otherwise returns the ID of the created instance.
  // Note: if the source is a string, and a model was already loaded from that string, only a new instance will be created.
  function loadInstance(source, textureMap) {
    if (typeof source === "string") {
      var modelId = loadModel(source);
      var id = modelInstanceCache.length;
      var instance = new ModelInstance(modelInstanceCache[modelId], id, textureMap);
      
      modelInstanceCache.push(instance);
      
      return id;
    } else if (typeof source === "number") {
      var object = modelInstanceCache[source];
      
      // Check if the source ID is valid
      if (object) {
        var model = object.isModel ? object : object.model;
        var id = modelInstanceCache.length;
        var instance = new ModelInstance(model, id);
        
        modelInstanceCache.push(instance);
        
        return id;
      }
    }
    
    return null;
  }
  
  // ---------------------
  // Model loading API
  // ---------------------
  
  // Load a resource from a given source.
  // The source caan be an absolute path to a MDX/M3 file, a path to a MDX/M3 file in any of the Warcraft 3 and Starcraft 2 MPQs, or a resource thread ID used by the Hiveworkshop
  // If loading from a resource thread, every model and texture in the resource thread will be loaded.
  function loadResource(source) {
    if (source.startsWith("http://")) {
      loadResourceImpl(source);
    } else if (source.match(/\.(?:mdx|m3|blp|dds|tga|png)$/)) {
      loadResourceImpl(urls.mpqFile(source));
    } else {
      getFile(urls.header(source), false, loadResourceFromId);//onerrorwrapper, onprogresswrapper);
    }
  }
  
  
  
  // ------------------
  // Instance misc
  // ------------------
  
  // Shows or hides an instance.
  function setVisibility(objectId, b) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.setVisibility(b);
    }
  }
  
  // Get the visibility status if an instance.
  function getVisibility(objectId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.getVisibility();
    }
  }
  
  // ------------------
  // Transform API
  // ------------------
  
  // Set the location of an instance.
  function setLocation(objectId, v) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.setLocation(v);
    }
  }
  
  // Move an instance.
  function move(objectId, v) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.move(v);
    }
  }
  
  // Get the location of an instance.
  function getLocation(objectId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      return object.getLocation();
    }
  }
  
  // Set the rotation of an instance.
  function setRotation(objectId, q) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.setRotation(q);
    }
  }
  
  // Rotate an instance.
  function rotate(objectId, q) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.rotate(q);
    }
  }
  
  // Get the rotation of an instance.
  function getRotation(objectId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      return object.getRotation();
    }
  }
  
  // Set the scale of an instance.
  function setScale(objectId, n) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.setScale(n);
    }
  }
  
  // Scale an instance.
  function scale(objectId, n) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.scale(n);
    }
  }
  
  // Get the scale of an instance.
  function getScale(objectId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      return object.getScale();
    }
  }
  
  // Set the parent of an instance to another instance, with an optional attachment point owned by that parent.
  function setParent(objectId, parentId, attachmentId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      if (parentId === -1) {
        object.setParent();
      } else {
        var parent = modelInstanceCache[parentId];
        
        if (parent && parent.isInstance) {
          object.setParent(parent, attachmentId);
        }
      }
    }
  }
  
  // Get the parent of an instance as an array.
  // The first index is the parent ID, the second is the attachment ID.
  function getParent(objectId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      return object.getParent();
    }
  }
  
  // -----------------------------
  // Team colors and textures
  // -----------------------------
  
  // Set the team color used by an instance.
  function setTeamColor(objectId, teamId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.setTeamColor(teamId);
    }
  }
  
  // Get the team color of an instance.
  function getTeamColor(objectId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      return object.getTeamColor();
    }
  }
  
  // Override a texture of an instance or a model with another texture.
  // If objectId is an instance, overrides the texture locally just for that instance.
  // If objectId is a model, it overrides the texture for the model, which affects all instances that don't explicitly override this texture.
  function overrideTexture(objectId, oldPath, newPath) {
    var object = modelInstanceCache[objectId];
    
    if (object) {
      object.overrideTexture(oldPath, newPath);
    }
  }
  
  // Get the texture map of an instance or model.
  function getTextureMap(objectId) {
    var object = modelInstanceCache[objectId];
    
    if (object) {
      return object.getTextureMap();
    }
  }
  
  // ------------
  // Sequences
  // ------------
  
  // Set the sequence of an instance.
  function setSequence(objectId, sequenceId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.setSequence(sequenceId);
    }
  }
  
  // Stop the sequence of an instance.
  // Equivalent to setSequence with sequence ID -1.
  function stopSequence(objectId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.setSequence(-1);
    }
  }
  
  // Get the current sequence of an instance.
  function getSequence(objectId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      return object.getSequence();
    }
  }
  
  // Sets the sequence loop mode of an instance.
  // Possible values are 0 for default, 1 for never, and 2 for always.
  function setSequenceLoopMode(objectId, mode) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.setSequenceLoopMode(mode);
    }
  }
  
  // Get the sequence loop mode of an instance.
  function getSequenceLoopMode(objectId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      return object.getSequenceLoopMode();
    }
  }
  
  // ----------
  // Getters
  // ----------
  
  // Get all the information of an object.
  function getInfo(objectId) {
    var object = modelInstanceCache[objectId];
    
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
      object = modelCache[source];
    
      if (object) {
        return object[1];
      }
    } else {
      object = modelInstanceCache[source];
      
      if (object) {
        if (object.isInstance) {
          return object.model.id;
        }
        
        return source;
      }
    }
  }
  
  // Get the source an object was created with.
  // If the object is an instance, returns the source that made the model this instance points to.
  function getSource(objectId) {
    var object = modelInstanceCache[objectId];
    
    if (object) {
      return object.getSource();
    }
  }
  
  // Get a list of the sequences owned by an object.
  // Proxies to the owning model if the given object is an instance.
  // Returns null if the object ID is invalid, or if the model didn't finish loading.
  function getSequences(objectId) {
    var object = modelInstanceCache[objectId];
    
    if (object) {
      return object.getSequences();
    }
  }
  
  // Get a list of the attachment points owned by an object.
  // Proxies to the owning model if the given object is an instance.
  // Returns null if the object ID is invalid, or if the model didn't finish loading.
  function getAttachments(objectId) {
    var object = modelInstanceCache[objectId];
    
    if (object) {
      return object.getAttachments();
    }
  }
  
  // Get a list of the cameras owned by an object.
  // Proxies to the owning model if the given object is an instance.
  // Returns null if the object ID is invalid, or if the model didn't finish loading.
  function getCameras(objectId) {
     var object = modelInstanceCache[objectId];
    
    if (object) {
      return object.getCameras();
    }
  }
  
  // -------------------
  // General settings
  // -------------------

  // Apply a camera of an instance.
  // When an instance camera is applied, the main camera is disabled.
  // If the given object ID is -1, the instance camera is disabled and the main camera becomes active.
  /*
  function applyCamera(objectId, cameraId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance && object.model.ready) {
      var camera = object.model.getCamera(cameraId);
      
      if (camera) {
        console.warn("Oops, still need to implement applyCamera");
      }
    }
  }
  */
  
  // Set the drawn world.
  // Possible values are 0 for nothing, 1 for sky, 2 for sky and ground, and 3 for sky and water.
  function setWorldMode(mode) {
    shouldRenderWorld = mode;
  }
  
  // Get the world mode.
  function getWorldMode() {
    return shouldRenderWorld;
  }
  
  // Shows or hides the bounding shapes for all instances.
  function setBoundingShapesMode(b) {
    shouldRenderShapes = b;
  }
  
  // Get the bounding shapes mode.
  function getBoundingShapesMode(b) {
    return shouldRenderShapes;
  }
  
  // Shows or hides team colors for all instances.
  function setTeamColorsMode(b) {
    shouldRenderTeamColors = b;
  }
  
  // Get the team colors mode.
  function getTeamColorsMode() {
    return shouldRenderTeamColors
  }
  
  // Set the shader to be used for Starcraft 2 models.
  // Set the shader to be used for Starcraft 2 models. Possible values are 0 for `standard`, 1 for `diffuse`, 2 for `normals`, 3 for `normal map`, 4 for `specular map`, 5 for `specular map + normal map`, 6 for `emissive`, 7 for `unshaded`, 8 for `unshaded + normal map`, and finally 9 for `decal`
  function setShader(id) {
    shaderToUse = id;
  }
  
  // Get the shader used for Starcraft 2 models.
  function getShader() {
    return shaderToUse;
  }
  
  // -------------------
  // Camera settings
  // -------------------
  
  // Pan the camera on the x and y axes.
  function panCamera(x, y) {
    camera.m[0] += x;
    camera.m[1] -= y;
  }
  
  // Rotate the camera on the x and y axes.
  function rotateCamera(x, y) {
    camera.r[0] += x;
    camera.r[1] += y;
  }
  
  // Zoom the camera by a factor.
  function zoomCamera(n) {
    camera.m[2] = parseInt(math.clamp(camera.m[2] * n, camera.range[0], camera.range[1]), 10);
  }
  
  // Reset the camera back to the initial state.
  function resetCamera() {
    camera.m[0] = 0;
    camera.m[1] = 0;
    camera.m[2] = 300;
    camera.r = [315, 225];
  }
  
  // ------
  // Misc
  // ------
  
  function castRay(x, y) {
    var z;
    
    // Viewport -> NDC
    x = (2 * x) / canvas.width - 1;
    y = 1 - (2 * y) / canvas.height;
    
    // NDC -> Homogeneous clip
    var clip = [x, y, -1, 1];
    
    // Homogeneous clip -> Eye
    var projectionMatrix = gl.getProjection();
    var inverseProjection = [];
    
    math.mat4.invert(projectionMatrix, inverseProjection);
    
    var eye = [];
    
    math.mat4.multVec4(inverseProjection, clip, eye);
    
    eye = [eye[0], eye[1], -1, 0];
    
    // Eye -> World
    var viewMatrix = gl.getMVP();
    var inverseView = [];
    
    math.mat4.invert(viewMatrix, inverseView);
    
    var worldRay = [];
    
    math.mat4.multVec4(inverseView, eye, worldRay);
    
    worldRay = [worldRay[0], worldRay[1], worldRay[2]];
    
    math.vec3.normalize(worldRay, worldRay);
    
    //console.log(worldRay);
  }
  
  // Save the scene as a JSON string.
  function saveScene() {
    var i, l;
    var data = [camera.m, camera.r, shouldRenderWorld, shouldRenderShapes & 1, shouldRenderTeamColors & 1, shaderToUse]
    // This keeps track of all the models that are actually used (= a visible instance points to them).
    var usedModels = {};
    var models = [];
    var instances = [];
    var object;
    var keys = Object.keys(modelCache);
    
    // Initialize the model usage map
    for (i = 0, l = keys.length; i < l; i++) {
      object = modelCache[keys[i]];
      
      if (object.ready) {
        usedModels[object.id] = 0;
      }
    }
    
    // Create the model usage map
    for (i = 0, l = modelInstanceCache.length; i < l; i++) {
      object = modelInstanceCache[i];
      
      if (object.ready && object.isInstance && object.visible) {
        usedModels[object.model.id]++;
      }
    }
    
    // Finally actually save all the visible objects
    for (i = 0, l = modelInstanceCache.length; i < l; i++) {
      object = modelInstanceCache[i];
      
      if (object.ready) {
        if (object.isModel) {
          if (usedModels[object.id] > 0) {
            models.push(object);
          }
        } else if (object.isInstance && object.visible) {
          instances.push(object);
        }
        
      }
    }
    
    data.push(models, instances);
    
    console.log(JSON.parse(JSON.stringify(data)));
    
    return JSON.stringify(data);
  }
  
  // Load a scene from a JSON string.
  function loadScene(scene) {
    var i, l;
    // Map from object IDs in the scene to actual indices in the object array.
    var idsMap = {};
    var id;
      
    scene = JSON.parse(scene);
    
    camera.m = scene[0];
    camera.r = scene[1];
    shouldRenderWorld = scene[2];
    shouldRenderShapes = !!scene[3];
    shouldRenderTeamColors = !!scene[4];
    shaderToUse = scene[5];
    
    var models = scene[6];
    var instances = scene[7];
    var object;
    var isModel;
    var owningModel;
      
    for (i = 0, l = models.length; i < l; i++) {
      object = models[i];
      
      id = loadModel(object[1], object[2]);
      
      modelInstanceCache[id].fromJSON(object);
      
      idsMap[object[0]] = id;
    }
    
    for (i = 0, l = instances.length; i < l; i++) {
      object = instances[i];
      
      owningModel = idsMap[object[1]];
      
      id = loadInstance(owningModel, object[10]);
      
      modelInstanceCache[id].fromJSON(object);
      
      idsMap[object[0]] = id;
    }
    
    // A second loop is needed to set the parents, since all the instances must be already loaded
    for (i = 0, l = instances.length; i < l; i++) {
      object = instances[i];
      
      setParent(idsMap[object[0]], idsMap[object[7]] || -1, object[8]);
    }
  }
  
  return {
    // Model loading API
    loadResource: loadResource,
    // Instance misc
    setVisibility: setVisibility,
    getVisibility: getVisibility,
    // Transform API
    setLocation: setLocation,
    move: move,
    getLocation: getLocation,
    setRotation: setRotation,
    rotate: rotate,
    getRotation: getRotation,
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
    setSequenceLoopMode: setSequenceLoopMode,
    // Information getters
    getInfo: getInfo,
    getModel: getModel,
    getSource: getSource,
    getSequences: getSequences,
    getAttachments: getAttachments,
    getCameras: getCameras,
    // General settings
    //applyCamera: applyCamera,
    setWorldMode: setWorldMode,
    getWorldMode: getWorldMode,
    setBoundingShapesMode: setBoundingShapesMode,
    getBoundingShapesMode: getBoundingShapesMode,
    setTeamColorsMode: setTeamColorsMode,
    getTeamColorsMode: getTeamColorsMode,
    setShader: setShader,
    getShader: getShader,
    // Camera settings
    panCamera: panCamera,
    rotateCamera: rotateCamera,
    zoomCamera: zoomCamera,
    resetCamera: resetCamera,
    // Misc
    castRay: castRay,
    saveScene: saveScene,
    loadScene: loadScene
   
  };
};