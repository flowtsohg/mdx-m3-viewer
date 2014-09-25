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
  var camera = {m: [0, 0, 0], r: [0, 0]};
  var cameraMatrix = mat4.create();
  var inverseCamera = mat4.create();
  var inverseCameraRotation = mat4.create();
  var xAxis = [1, 0, 0];
  var yAxis = [0, 1, 0];
  var zAxis = [0, 0, 1];
  var lightPosition = [0, 0, 10000];
  var cameraPosition = vec3.create();
  var instanceCamera = [-1, -1];
  var grass_water;
  var bedrock;
  var sky;
  var uvOffset = [0, 0];
  var uvSpeed = [math.random(-0.004, 0.004), math.random(-0.004, 0.004)];
  var upDir = [0, 0, 1];
  
  var shouldRenderWorld = 2;
  var groundSize = 256;
  
  // To reference models by their source.
  var modelCache = {};
    
  // To loop over the instances
  var instanceCache = [];
    
  // To reference models or instances by their ID.
  var modelInstanceCache = [];
  
  // To reference an instance from a picked color
  var colorInstanceCache = {};
    
  var FRAME_TIME_MS = 1000 / 60;
  var FRAME_TIME = FRAME_TIME_MS / 1000;
    
  var DEBUG_MODE = debugMode;
  
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
  
  var context = {
    worldMode: 2,
    meshesMode: true,
    emittersMode: true,
    polygonMode: true,
    teamColorsMode: true,
    boundingShapesMode: false,
    texturesMode: true,
    shader: 0,
    particleRect: [vec3.fromValues(-1, -1, 0), vec3.fromValues(-1, 1, 0), vec3.fromValues(1, 1, 0), vec3.fromValues(1, -1, 0), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(0, 0, 1)],
    particleBillboardedRect: [vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create()]
  };
  
  
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