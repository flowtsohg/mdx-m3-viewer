window["ModelViewer"] = function (canvas, urls, onmessage, debugMode) {
  var grassPath = urls.localFile("grass.png");
  var waterPath = urls.localFile("water.png");
  var bedrockPath = urls.localFile("bedrock.png");
  var skyPath = urls.localFile("sky.png");
  
  // This function is used to filter out reports for internal textures (e.g. ground, sky, team colors beside 00, etc.).
  function noReport(path) {
    if (path ===grassPath || path === waterPath || path === bedrockPath || path === skyPath || path.match(/(\d\d).blp/)) {
      return true;
    }
    
    return false;
  }
  
  function sendMessage(e) {
    if (typeof onmessage === "function") {
      onmessage(e);
    }
  }
  
  function onloadstart(object) {
    var source = object.source;
    
    if (object.isModel) {
      sendMessage({type: "loadstart", objectType: "model", source: source});
    } else if (object.isTexture) {
      if (!noReport(source)) {
       sendMessage({type: "loadstart", objectType: "texture", source: source});
      }
    } else if (object.isHeader) {
      sendMessage({type: "loadstart", objectType: "header", source: source});
    } else {
      console.log("onloadstart", "What?");
    }
  }
  
  function onload(object) {
    var source = object.source;
    
    if (object.isModel) {
       sendMessage({type: "load", objectType: "model", source: source, id: object.id});
    } else if (object.isTexture) {
      if (!noReport(source)) {
        sendMessage({type: "load", objectType: "texture", source: source});
      }
    } else if (object.isHeader) {
      sendMessage({type: "load", objectType: "header", source: source});
    } else if (object.isInstance) {
      sendMessage({type: "load", objectType: "instance", source: source, id: object.id});
    } else {
      console.log("onload", "What?");
    }
  }
  
  function onerror(object, error) {
    var type, source;
    
    if (object.isTexture) {
      type = "texture";
      source = object.source;
    } else if (object.isModel) {
      type = "model";
      source = object.source;
    } else if (object.isHeader) {
      type = "header";
      source = object.source;
    } else if (object.isGL) {
      type = "webglcontext";
      source = "";
    } else if (object.isShader) {
      type = "shader";
      source = object.name;
    } else {
      console.log("onerror", "What?");
    }
    
    if (typeof error !== "string") {
      error = "" + error.target.status;
    }
    
    sendMessage({type: "error", objectType: type, source: source, error: error});
  }
  
  function onprogress(object, e) {
    var progress = e.loaded / e.total;
    var source = object.source;
    var status = e.target.status;
    
    if (status === 200) {
      if (progress === Infinity) {
        progress = 0;
      }
      
      if (object.isModel) {
        sendMessage({type: "progress", objectType: "model", source: source, progress: progress});
      } else if (object.isTexture) {
        if (!noReport(source)) {
          sendMessage({type: "progress", objectType: "texture", source: source, progress: progress});
        }
      } else if (object.isHeader) {
        sendMessage({type: "progress", objectType: "header", source: source, progress: progress});
      } else {
        console.log("onprogress", "What?");
        console.log(object);
      }
    } else {
      onerror(object, e);
    }
  }
  
  function onerrorwrapper(e) {
    onerror(this, e);
  }
  
  function onprogresswrapper(e) {
    onprogress(this, e);
  }
  
  var gl = GL(canvas, onload, onerrorwrapper, onprogresswrapper, onloadstart, onerror);
  
  if (!gl) {
    return;
  }
  
  var ctx = gl.ctx;
  var cameraMatrix = mat4.create();
  var inverseCamera = mat4.create();
  var inverseCameraRotation = mat4.create();
  var xAxis = [1, 0, 0];
  var yAxis = [0, 1, 0];
  var zAxis = [0, 0, 1];
  var lightPosition = [0, 0, 10000];
  var cameraPosition = vec3.create();
  var grass_water;
  var bedrock;
  var sky;
  var uvOffset = [0, 0];
  var uvSpeed = [math.random(-0.004, 0.004), math.random(-0.004, 0.004)];
  var upDir = [0, 0, 1];
  
  var idFactory = -1;
  var modelArray = []; // All models
  var instanceArray = []; // All instances
  var modelInstanceMap = {}; // Referebce by ID. This is a map to support deletions.
  var modelMap = {}; // Reference by source
  var instanceMap = {}; // Reference by color
  
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
    gl: gl
  };
  
  var DEBUG_MODE = debugMode;
  
  var supportedFileTypes = {"mdx":1, "m3":1, "blp":1, "dds":1, "tga":1, "png":1, "gif":1, "jpg":1};
  var supportedModelFileTypes = {"mdx":1, "m3":1};
  var supportedTextureFileTypes = {"blp":1, "dds":1, "tga":1, "png":1, "gif":1, "jpg":1};
  
  // If an object has a visibility value below the cutoff, it shouldn't render.
  // This value is taken from Blizzard's Art Tools.
  var VISIBILITY_CUTOFF = 0.75;
  
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
  
  function bindTexture(source, unit, modelTextureMap, instanceTextureMap) {
    var texture;
    
    if (modelTextureMap[source]) {
      texture = modelTextureMap[source];
    }
    
    if (instanceTextureMap[source]) {
      texture = instanceTextureMap[source];   
    }
    
    if (!context.teamColorsMode && source.endsWith("00.blp")) {
      texture = null;
    }
    
    gl.bindTexture(texture, unit);
  }
  
  function saveContext() {
    var camera = context.camera,
          translation = math.floatPrecisionArray(camera[0], 0),
          rotation = math.floatPrecisionArray(math.toDeg(camera[1]), 0);
    
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
          rotation = math.toRad(camera[1]);
    
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