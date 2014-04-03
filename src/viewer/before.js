// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

window["ModelViewer"] = function (canvas, onmessage, isDebug) {
  function sendMessage(e) {
    if (typeof onmessage === "function") {
      onmessage(e);
    }
  }
  
  function onloadstart(object) {
    if (object.isModel) {
      sendMessage({type: "loadstart", objectType: "model", name: object.source, progress: 0});
    } else if (object.isTexture) {
      sendMessage({type: "loadstart", objectType: "texture", name: object.name, progress: 0});
    } else {
      console.log("What?");
    }
  }
  
  function onload(object) {
     if (object.isModel) {
       sendMessage({type: "load", objectType: "model", name: object.source, progress: 1});
    } else if (object.isTexture) {
      sendMessage({type: "load", objectType: "texture", name: object.name, progress: 1});
    } else {
      console.log("What?");
    }
  }
  
  function onerror(object, e) {
    var reason = e.reason;
    
    if (reason === "WebGLContext" || reason === "VertexTexture" || reason === "FloatTexture" || reason === "CompressedTextures") {
      sendMessage({type: "error", objectType: "webglcontext", reason: reason});
    }
    
    console.log(object);
    console.log(e);
  }
  
  function onprogress(object, e) {
    if (object.isModel) {
      sendMessage({type: "progress", objectType: "model", name: object.source, progress: (e.loaded / e.total)});
    } else if (object.isTexture) {
      sendMessage({type: "progress", objectType: "texture", name: object.name, progress: (e.loaded / e.total)});
    } else {
      console.log("What?");
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
  var shaderToUse = "sstandard";
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
    [40, 40, 40]
  ];