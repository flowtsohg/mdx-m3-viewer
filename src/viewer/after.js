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
  
  // Used by the MDX shader to dynamically create the team glow
  gl.newTexture("TeamGlow", "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gODAK/9sAQwAGBAUGBQQGBgUGBwcGCAoQCgoJCQoUDg8MEBcUGBgXFBYWGh0lHxobIxwWFiAsICMmJykqKRkfLTAtKDAlKCko/9sAQwEHBwcKCAoTCgoTKBoWGigoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgo/8AAEQgAIAAgAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A+VKesbN0FES7nArufC3h4XwGRnNAHDtEy9Qajr0bxN4ZFlESBXn9ymyUigBkLbXBr0PwfryWQG4ivOamjnZOhNAHpnizxHHeQkKRXmd0++UmiS4d+pNRE5NAH//Z");
  
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
  
  // ---------------------
  // Model loading API
  // ---------------------
  
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
      var parent = modelInstanceCache[parentId];
      
      if (parent && parent.isInstance) {
        object.setParent(parent, attachmentId);
      }
    }
  }
  
  // Get the parent of an instance as an array.
  // The first index is the parent ID, the second, if exists, is the attachment ID.
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
  
  // Set the animation of an instance.
  function setSequence(objectId, sequenceId) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.setSequence(sequenceId);
    }
  }
  
  // Stop the animation of an instance.
  // Equivalent to playAnimation with animation ID -1.
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
  
  // Sets the animation loop mode of an instance.
  // Possible values are 0 for default, 1 for never, and 2 for always.
  function setSequenceLoopMode(objectId, mode) {
    var object = modelInstanceCache[objectId];
    
    if (object && object.isInstance) {
      object.setSequenceLoopMode(mode);
    }
  }
  
  // Gets the animation loop mode of an instance.
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
  function getObjectInfo(objectId) {
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
  function getCameras(objectId) {
     var object = modelInstanceCache[objectId];
    
    if (object && object.isModel) {
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
  function setWorld(mode) {
    shouldRenderWorld = mode;
  }
  
  // Shows or hides the bounding shapes on all the instances.
  function showBoundingShapes(b) {
    shouldRenderShapes = b;
  }
  
  // Shows or hides team colors for all instances.
  function showTeamColors(b) {
    shouldRenderTeamColors = b;
  }
  
  // Set the shader to be used for Starcraft 2 models.
  function setShader(id) {
    shaderToUse = id;
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
  
  function setScene(scene) {
    scene = JSON.parse(scene);
    
    camera.m[0] = scene[0][0];
    camera.m[1] = scene[0][1];
    camera.m[2] = scene[0][2];
    camera.r[0] = scene[0][3];
    camera.r[1] = scene[0][4];
    shouldRenderWorld = scene[1];
    shouldRenderShapes = scene[2];
    
    var instances = scene[4];
    
    for (var i = 0, l = instances.length; i < l; i++) {
      var instance = instances[i];
      var instanceImpl = loadInstance(instance[0]);
      
      setPosition(instanceImpl, instance[1]);
      setRotation(instanceImpl, instance[2]);
      setScaling(instanceImpl, instance[3]);
      playAnimatrion(instanceImpl, instance[4]);
      setTeamColor(instanceImpl, instance[5]);
    }
  }
  
  function saveScene() {
    var cameraString = [camera.m[0], camera.m[1], camera.m[2], camera.r[0], camera.r[1]];
    var modelsString = [];
    var instancesString = [];
    var finalString = {};
      
    for (var i = 0, l = modelInstanceCache.length; i < l; i++) {
      var object = modelInstanceCache[i];
      
      if (object.isModel) {
        modelsString.push([object.source]);
      } else {
        instancesString.push([object.model.source, object.position, object.rotation, object.scaling, object.instance.sequence, object.teamId]);
      }
    }
    
    finalString[0] = cameraString;
    finalString[1] = shouldRenderWorld;
    finalString[2] = shouldRenderShapes;
    finalString[3] = modelsString;
    finalString[4] = instancesString;
    
    return JSON.stringify(finalString);
  }
  
  return {
    // Model loading API
    loadModel: loadModel,
    loadInstance: loadInstance,
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
    getObjectInfo: getObjectInfo,
    getModel: getModel,
    getSource: getSource,
    getSequences: getSequences,
    getAttachments: getAttachments,
    getCameras: getCameras,
    // General settings
    //applyCamera: applyCamera,
    setWorld: setWorld,
    showBoundingShapes: showBoundingShapes,
    showTeamColors: showTeamColors,
    setShader: setShader,
    // Camera settings
    panCamera: panCamera,
    rotateCamera: rotateCamera,
    zoomCamera: zoomCamera,
    resetCamera: resetCamera,
    // Misc
    castRay: castRay,
    setScene: setScene,
    saveScene: saveScene
  };
};