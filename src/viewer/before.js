/**
 * @class The main model viewer object.
 * @name ModelViewer
 * @param {HTMLCanvasElement} canvas A canvas element.
 * @param {object} urls An object with the necessary methods to get urls from the viewer.
 * @param {function} onmessage A callback function, which the viewer will call with messages.
 * @param {boolean} debugMode If true, the viewer will log the loaded models and their parser to the console.
 */
window["ModelViewer"] = function (canvas, urls, onmessage, debugMode) {
  var grassPath = urls.localFile("grass.png");
  var waterPath = urls.localFile("water.png");
  var bedrockPath = urls.localFile("bedrock.png");
  var skyPath = urls.localFile("sky.png");
  
  // This function is used to filter out reports for internal textures (e.g. ground, sky, team colors beside 00, etc.).
  function noReport(path) {
    if (path === grassPath || path === waterPath || path === bedrockPath || path === skyPath || path.match(/(\d\d).blp/)) {
      return true;
    }
    
    return false;
  }
  
  function sendMessage(e) {
    if (typeof onmessage === "function") {
      onmessage(e);
    }
  }
  
  function objectTypeName(object) {
    if (object.isModel) {
      return "model";
    } else if (object.isInstance) {
      return "instance";
    } else if (object.isHeader) {
      return "header";
    } else if (object.isTexture) {
      return "texture";
    } else if (object.isWebGL) {
      return "webgl";
    } else if (object.isShader) {
      return "shader";
    }
  }
  
  function onloadstart(object) {
    var source = object.source;
    
    if (!noReport(source)) {
      sendMessage({type: "loadstart", objectType: objectTypeName(object), source: source});
    }
  }
  
  function onload(object) {
    var source = object.source,
          message;
    
    if (!noReport(source) ){
      message = {type: "load", objectType: objectTypeName(object), source: source};
      
      if (object.isModel || object.isInstance) {
        message.id = object.id;
      }
      
      sendMessage(message);
    }
  }
  
  function onerror(object, error) {
    sendMessage({type: "error", objectType: objectTypeName(object), source: object.source, error: error});
  }
  
  function onprogress(object, e) {
    var source = object.source,
          progress = e.loaded / e.total;
    
    if (e.target.status === 200) {
      if (!noReport(source)) {
        if (progress === Infinity) {
          progress = 0;
        }
      
        sendMessage({type: "progress", objectType: objectTypeName(object), source: source, progress: progress});
      }
    }
  }
  
  function onunload(object) {
    var message = {type: "unload", objectType: objectTypeName(object), source: object.source};
    
    if (object.isModel || object.isInstance) {
      message.id = object.id;
    }
      
    sendMessage(message);
  }
  
  var gl = GL(canvas, onload, onerror, onprogress, onloadstart, onunload);
  
  if (!gl) {
    return;
  }
  
  var ctx = gl.ctx;
  var cameraMatrix = mat4.create();
  var inverseCamera = mat4.create();
  var inverseCameraRotation = mat4.create();
  var lightPosition = [0, 0, 10000];
  var cameraPosition = vec3.create();
  var grass_water;
  var bedrock;
  var sky;
  var uvOffset = [0, 0];
  var uvSpeed = [Math.randomRange(-0.004, 0.004), Math.randomRange(-0.004, 0.004)];
  
  var idFactory = -1;
  var modelArray = []; // All models
  var instanceArray = []; // All instances
  var modelInstanceMap = {}; // Referebce by ID. This is a map to support deletions.
  var modelMap = {}; // Reference by source
  var instanceMap = {}; // Reference by color
  
  var supportedFileTypes = {"png":1, "gif":1, "jpg":1};
  var supportedModelFileTypes = {};
  var supportedTextureFileTypes = {"png":1, "gif":1, "jpg":1};
  
  var teamColors = [
    [255, 3, 3],
    [0, 66, 255],
    [28, 230, 185],
    [84, 0, 129],
    [255, 252, 1],
    [254, 138, 14],
    [32, 192, 0],
    [229, 91, 176],
    [149, 150, 151],
    [126, 191, 241],
    [16, 98, 70],
    [78, 42, 4],
    [40, 40, 40],
    [0, 0, 0]
  ];
  
  var shaders = [
    "standard",
    "diffuse",
    "normals",
    "uvs",
    "normalmap",
    "specular",
    "specular_normalmap",
    "emissive",
    "unshaded",
    "unshaded_normalmap",
    "decal",
    "white"
  ];
  
  // Used by Mdx.ParticleEmitter since they don't need to be automatically updated and rendered
  function loadInternalResource(source) {
    if (!modelMap[source]) {
      modelMap[source] = new AsyncModel(source);
      onloadstart(modelMap[source]);
    }
    
    var instance = new AsyncModelInstance(modelMap[source]);
    
    onloadstart(instance);
    
    // Avoid reporting this instance since it's internal
    instance.delayOnload = true;
    
    return instance;
  }
  
  var context = {
    frameTime: 1000 / 60,
    camera: [[0, 0, 0], [0, 0]],
    instanceCamera: [-1, -1],
    worldMode: 2,
    groundSize: 256,
    meshesMode: true,
    emittersMode: true,
    polygonMode: true,
    teamColorsMode: true,
    boundingShapesMode: false,
    texturesMode: true,
    shader: 0,
    particleRect: [vec3.fromValues(-1, -1, 0), vec3.fromValues(-1, 1, 0), vec3.fromValues(1, 1, 0), vec3.fromValues(1, -1, 0), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(0, 0, 1)],
    particleBillboardedRect: [vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create()],
    gl: gl,
    debugMode: debugMode,
    teamColors: teamColors,
    shaders: shaders,
    cameraPosition: cameraPosition,
    lightPosition: lightPosition,
    loadInternalResource: loadInternalResource
  };
  
  function saveContext() {
    var camera = context.camera,
          translation = Array.setFloatPrecision(camera[0], 0),
          rotation = Array.setFloatPrecision(Array.toDeg(camera[1]), 0);
    
    return [
      context.frameTime / 1000 * 60,
      [translation, rotation],
      context.instanceCamera,
      context.worldMode,
      context.groundSize,
      context.meshesMode & 1,
      context.polygonMode & 1,
      context.teamColorsMode & 1,
      context.boundingShapesMode & 1,
      context.texturesMode & 1,
      context.shader
    ];
  }
  
  function loadContext(object) {
    var camera = object[1],
          translation = camera[0],
          rotation = Array.toRad(camera[1]);
    
    context.frameTime = object[0] / 60 * 1000;
    context.camera = [translation, rotation],
    context.instanceCamera = object[2];
    context.worldMode = object[3];
    setGroundSize(object[4] * 2);
    context.meshesMode = !!object[5];
    context.polygonMode = !!object[6];
    context.teamColorsMode = !!object[7];
    context.boundingShapesMode = !!object[8];
    context.texturesMode = !!object[9];
    context.shader = object[10];
  }