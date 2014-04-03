// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

  gl.setShaderMaps(PARAMETERMAP, MEMBERMAP);
  
  //addEvent(document.getElementById("shaders-select"), "change", function (e) {
  //  shaderToUse = e.target.value;
  //});
  
  function resetViewport() {
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    
    // For some reason the CSS3 calc doesn't actually change the size of the internal canvas.
    // This doesn't let WebGL to properly set up the viewport, so the size must be set manually.
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    gl.viewSize(width, height);
    gl.setPerspective(45, width / height, 0.1, 5E4);
  }
  
  resetViewport();
  
  // Takes care of the viewport when the window is resized
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
  
  // Preload all the WC3 team colors and glows (probably from the cache) so that changing team colors for the first time is instant
  for (var i = 0; i < 13; i++) {
    var number = ((i < 10) ? "0" + i : i);
    var teamColor = "ReplaceableTextures/TeamColor/TeamColor" + number + ".blp";
    var teamGlow = "ReplaceableTextures/TeamGlow/TeamGlow" + number + ".blp";
    
    gl.newTexture(teamColor, urls.mpqFile(teamColor));
    gl.newTexture(teamGlow, urls.mpqFile(teamGlow));
  }
  
  gl.newShader("world", SHADERS["vsworld"], floatPrecision + SHADERS["psworld"]);
  gl.newShader("white", SHADERS["vswhite"], floatPrecision + SHADERS["pswhite"]);
  
  gl.newTexture("grass", "http://www.hiveworkshop.com/model_viewer/images/grass.png");
  gl.newTexture("water", "http://www.hiveworkshop.com/model_viewer/images/water.png");
  gl.newTexture("bedrock", "http://www.hiveworkshop.com/model_viewer/images/bedrock.png");
  gl.newTexture("sky", urls.mpqFile("Environment/Sky/LordaeronSummerSky/LordaeronSummerSky.blp"));
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
          
          gl.bindTexture("water", 0);
          grass_water.render();
          
          ctx.disable(ctx.BLEND);
        } else {
          gl.bindTexture("bedrock", 0);
          bedrock.render();
        }
      } else {
        gl.bindTexture("grass", 0);
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
      
      gl.bindTexture("sky");
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
        modelInstanceCache[i].render();
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
  
  // ------------------
  // API starts here
  // ------------------
  
  // Load a model.
  // Source can be an absolute path to a MDX/M3 file, a path to a MDX/M3 file in any of the Warcraft 3 and Starcraft 2 MPQs, or a model ID used by the Hiveworkshop.
  // Returns the ID of the loaded model.
  // Note: if a model was already loaded from the given source, its ID will be returned.
  function loadModel(source) {
    if (!modelCache[source]) {
      var model = new Model(source);
      var id = modelInstanceCache.length;
      
      model.id = id;
      modelCache[source] = [model, id];
      
      modelInstanceCache.push(model);
    }
    
    return modelCache[source][1];
  }
  
  // Create a new instance from an existing model or instance, or a path that will be used to load also the model if needed.
  // If source is a string, it can be an absolute path to a MDX/M3 file, a path to a MDX/M3 file in any of the Warcraft 3 and Starcraft 2 MPQs, or a model ID used by the Hiveworkshop.
  // If source is a number, it can be an ID of a model or an instance.
  // Returns null if given an invalid ID, otherwise returns the ID of the created instance.
  // Note: if the source is a string, and a model was already loaded from that string, only a new instance will be created.
  function loadInstance(source) {
    if (typeof source === "string") {
      var modelId = loadModel(source);
      var instance = new ModelInstance(modelInstanceCache[modelId]);
      var id = modelInstanceCache.length;
      
      instance.id = id;
      modelInstanceCache.push(instance);
      
      return id;
    } else if (typeof source === "number") {
      var object = modelInstanceCache[modelId];
      
      // Check if the source ID is valid
      if (object) {
        var model = object.isModel ? object : object.model;
        var instance = new ModelInstance(model);
        var id = modelInstanceCache.length;
        
        instance.id = id;
        modelInstanceCache.push(instance);
        
        return id;
      }
    }
    
    return null;
  }
  
  // Return the model ID that an instance points to.
  function getModelFromInstance(objectId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      return object.model.id;
    }
  }
  
  // Return the model ID that was loaded with the given path.
  function getModelFromPath(path) {
    var object = modelCache[path];
    
    if (object) {
      return object[1];
    }
  }
  
  // Set the position of an instance.
  function setPosition(objectId, v) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.setPosition(v);
    }
  }
  
  // Move an instance.
  function move(objectId, v) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.move(v);
    }
  }
  
  // Set the rotation of an instance.
  function setRotation(objectId, v) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.setRotation(v);
    }
  }
  
  // Rotate an instance.
  function rotate(objectId, v) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.rotate(v);
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
  
  // Set the parent of an instance to another instance, with an optional attachment point owned by that parent.
  function setParent(objectId, parentId, attachmentId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      var parent = modelInstanceCache[parentId];
      
      if (parent && parent.isInstance) {
        object.setParent(parent, attachmentId);
      }
    }
  }
  
  // Set the team color used by an instance.
  function setTeamColor(objectId, teamId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.setTeamColor(teamId);
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
  
  // Set the animation of an instance.
  function playAnimation(objectId, sequenceId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.setAnimation(sequenceId);
    }
  }
  
  // Stop the animation of an instance.
  // Equivalent to playAnimation with animation ID -1.
  function stopAnimation(objectId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.setAnimation(-1);
    }
  }
  
  // Sets the animation loop mode of an instance.
  // Possible values are 0 for default, 1 for never, and 2 for always.
  function setAnimationLoop(objectId, mode) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.setAnimationLoop(mode);
    }
  }
  
  // Get a list of the sequences owned by a model.
  // Returns null if the object ID is invalid or not a model, or if the model didn't finish loading.
  function getSequences(objectId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isModel) {
      return object.getSequences();
    }
  }
  
  // Get a list of the attachment points owned by a model.
  // Returns null if the object ID is invalid or not a model, or if the model didn't finish loading.
  function getAttachments(objectId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isModel) {
      return object.getAttachments();
    }
  }
  
  // Get a list of the cameras owned by a model.
  // Returns null if the object ID is invalid or not a model, or if the model didn't finish loading.
  /*
  function getCameras(objectId) {
     var object = modelInstanceCache[objectId];
    
    if (object && object.isModel) {
      return object.getCameras();
    }
  }
  */
  
  // -----------------
  // Global settings
  // -----------------

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
  
  // Set the drawn scene.
  // Possible values are 0 for nothing, 1 for sky, 2 for sky and ground, and 3 for sky and water.
  function setScene(mode) {
    shouldRenderWorld = mode;
  }
  
  // Shows or hides the bounding shapes on all the instances.
  function showBoundingShapes(b) {
    shouldRenderShapes = b;
  }
  
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
    camera.m[2] = math.clamp(camera.m[2] * n, camera.range[0], camera.range[1]);
  }
  
  // Reset the camera back to the initial state.
  function resetCamera() {
    camera.m[0] = 0;
    camera.m[1] = 0;
    camera.m[2] = 300;
    camera.r = [315, 225];
  }
  
  return {
    loadModel: loadModel,
    loadInstance: loadInstance,
    getModelFromInstance: getModelFromInstance,
    getModelFromPath: getModelFromPath,
    setPosition: setPosition,
    move: move,
    setRotation: setRotation,
    rotate: rotate,
    setScale: setScale,
    scale: scale,
    setParent: setParent,
    setTeamColor: setTeamColor,
    overrideTexture: overrideTexture,
    playAnimation: playAnimation,
    stopAnimation: stopAnimation,
    getSequences: getSequences,
    getAttachments: getAttachments,
    //getCameras: getCameras,
    //applyCamera: applyCamera,
    setScene: setScene,
    showBoundingShapes: showBoundingShapes,
    panCamera: panCamera,
    rotateCamera: rotateCamera,
    zoomCamera: zoomCamera,
    resetCamera: resetCamera
  };
};