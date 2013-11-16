// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)
  
window["Viewer"] = function (args) {
  var canvas = args.canvas;
  var gl = GL(canvas);
  var ctx = gl.gl;
  var camera = {m: [0, 0, 0], range: [0, 0], r: [0, 0]};
  var cameraPosition = [0, 0, 0];
  var lightPosition = [0, 0, 2.5];
  var RENDER_MODE = 0;
  var customTextures = {};
  var model;
  var modelCameraId = -1;
  var modelCamera;
  var grass_water;
  var bedrock;
  var sky;
  var uvOffset = [0, 0];
  var uvSpeed = [math.random(-0.004, 0.004), math.random(-0.004, 0.004)];
  //var light;
  var shouldRenderWorld = 2;
  var shouldRenderLights = true;
  var shouldRenderShapes = false;
  var shaderToUse = "standard";
  var format = 0;
  var floatPrecision = "precision mediump float;\n";
  var standardShader;
  var particleShader;
  var ribbonShader;
  var worldShader;
  var whiteShader;
    
  var FRAME_TIME = 1 / 60;
  var ANIMATION_SCALE = 1;
  var MODEL_ID = args.MODEL_ID;
  var MODEL_PATH = args.MODEL_PATH;
  var MPQ_PATH = args.MPQ_PATH;
  var DEBUG_MODE = args.DEBUG_MODE;
  var HAS_FLOAT_TEXTURE = ctx.getExtension("OES_texture_float");
  var HAS_VERTEX_TEXTURE = ctx.getParameter(ctx.MAX_VERTEX_TEXTURE_IMAGE_UNITS) > 0;
  var VERTEX_UNIFORM_VECTORS = ctx.getParameter(ctx.MAX_VERTEX_UNIFORM_VECTORS);
  
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