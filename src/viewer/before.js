// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

window["ModelViewer"] = function (canvas, urls, onmessage, isDebug) {
  function sendMessage(e) {
    if (typeof onmessage === "function") {
      onmessage(e);
    }
  }
  
  function onloadstart(object) {
    if (object.isModel) {
      sendMessage({type: "loadstart", objectType: "model", source: object.source, progress: 0});
    } else if (object.isTexture) {
      var path = object.name;
      
      // Avoid reporting internal textures
      if (path !== "\0"  && path !== "grass" && path !== "water" && path !== "bedrock" && path !== "sky") {
        var match = path.match(/(\d\d).blp/);
        
        if (!match || match[1] === "00") {
          sendMessage({type: "loadstart", objectType: "texture", source: path, progress: 0});
        }
      }
    } else {
      console.log("onloadstart", "What?");
    }
  }
  
  function onload(object) {
     if (object.isModel) {
       sendMessage({type: "load", objectType: "model", source: object.source, id: object.id, progress: 1});
    } else if (object.isTexture) {
      var path = object.name;
      
      // Avoid reporting internal textures
      if (path !== "\0"  && path !== "grass" && path !== "water" && path !== "bedrock" && path !== "sky") {
        var match = path.match(/(\d\d).blp/);
        
        if (!match || match[1] === "00") {
          sendMessage({type: "load", objectType: "texture", source: path, progress: 1});
        }
      }
    } else if (object.isInstance) {
      sendMessage({type: "load", objectType: "instance", source: object.source, id: object.id, progress: 1});
    } else {
      console.log("onload", "What?");
    }
  }
  
  function onerror(object, error) {
    var type, source;
    
    if (object.isTexture) {
      type = "texture";
      source = object.name;
    } else if (object.isModel) {
      type = "model";
      source = object.source;
    } else if (object.isGL) {
      type = "webglcontext";
      source = "";
    } else {
      console.log("onerror", "What?");
    }
    
    sendMessage({type: "error", objectType: type, source: source, error: error});
  }
  
  function onprogress(object, e) {
    var progress = e.loaded / e.total;
    
    if (progress === Infinity) {
      progress = 0;
    }
    
    if (object.isModel) {
      sendMessage({type: "progress", objectType: "model", source: object.source, progress: progress});
    } else if (object.isTexture) {
      var path = object.name;
      
      // Avoid reporting internal textures
      if (path !== "\0"  && path !== "grass" && path !== "water" && path !== "bedrock" && path !== "sky") {
        var match = path.match(/(\d\d).blp/);
        
        if (!match || match[1] === "00") {
          sendMessage({type: "progress", objectType: "texture", source: path, progress: progress});
        }
      }
    } else {
      console.log("onprogress", "What?");
      console.log(object);
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
  
  var ctx = gl.gl;
  var camera = {m: [0, 0, 0], range: [0, 0], r: [0, 0]};
  var cameraPosition = [0, 0, 0];
  var lightPosition = [0, 0, 500];
  var modelCameraId = -1;
  var modelCamera;
  var grass_water;
  var bedrock;
  var sky;
  var uvOffset = [0, 0];
  var uvSpeed = [math.random(-0.004, 0.004), math.random(-0.004, 0.004)];
  var upDir = [0, 0, 1];
  //var light;
  var shouldRenderWorld = 2;
  var shouldRenderLights = true;
  var shouldRenderShapes = false;
  var shouldRenderTeamColors = true;
  var shaderToUse = 0;
  var floatPrecision = "precision mediump float;\n";
  
  // To reference models by their source.
  var modelCache = {};
    
  // To reference models or instances by their ID.
  var modelInstanceCache = [];
  
  var FRAME_TIME = 1 / 60;
  var DEBUG_MODE = isDebug;
  
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
    "sstandard",
    "sdiffuse",
    "snormals",
    "snormalmap",
    "sspecular",
    "sspecular_normalmap",
    "semissive",
    "sunshaded",
    "sunshaded_normalmap",
    "sdecal"
  ];
  
  function bindTexture(glTexture, unit, textureMap) {
    var texture = glTexture;
    
    // Set in ModelInstance.overrideTexture if given a null texture (used for None)
    if (texture === -1) {
      texture = null;
    }
    
    if (texture && textureMap[texture.name]) {
      texture = textureMap[texture.name];
    }
    
    gl.bindTexture(texture, unit);
  }