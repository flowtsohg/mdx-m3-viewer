function GL(element, onload, onerror, onprogress, onloadstart, unboundonerror) {
  var ctx;
  var identifiers = ["webctx", "experimental-webctx", "webkit-3d", "moz-webctx"];
  
  for (var i = 0, l = identifiers.length; i < l; ++i) {
    try {
      ctx = element.getContext(identifiers[i], {antialias: true, alpha: false});
    } catch(e) {}

    if (ctx) {
      break;
    }
  }
  
  if (!ctx) {
    unboundonerror({isGL: true}, "WebGLContext");
    return;
  }
  
  var hasVertexTexture = ctx["getParameter"](ctx["MAX_VERTEX_TEXTURE_IMAGE_UNITS"]) > 0;
  var hasFloatTexture = ctx["getExtension"]("OES_texture_float");
  var compressedTextures = ctx["getExtension"]("WEBGL_compressed_texture_s3tc");
  
  if (!hasVertexTexture) {
    unboundonerror({isGL: true}, "VertexTexture");
    return;
  }
  
  if (!hasFloatTexture) {
    unboundonerror({isGL: true}, "FloatTexture");
    return;
  }
  
  if (!compressedTextures) {
    unboundonerror({isGL: true}, "CompressedTextures");
  }
  
  var refreshViewProjectionMatrix = false;
  var projectionMatrix = math.mat4.createIdentity();
  var viewMatrix = math.mat4.createIdentity();
  var viewProjectionMatrix = math.mat4.createIdentity();
  var matrixStack = [];
  var textureStore = {};
  var shaderUnitStore = {};
  var shaderStore = {};
  var boundShader;
  var boundShaderName = "";
  var boundTextures = [];
  var floatPrecision = "precision mediump float;\n";
    
  ctx["viewport"](0, 0, element.clientWidth, element.clientHeight);
  ctx["depthFunc"](ctx["LEQUAL"]);
  ctx["enable"](ctx["DEPTH_TEST"]);
  ctx["enable"](ctx["CULL_FACE"]);
  
  function textureOptions(wrapS, wrapT, magFilter, minFilter) {
    ctx["texParameteri"](ctx["TEXTURE_2D"], ctx["TEXTURE_WRAP_S"], ctx[wrapS]);
    ctx["texParameteri"](ctx["TEXTURE_2D"], ctx["TEXTURE_WRAP_T"], ctx[wrapT]);
    ctx["texParameteri"](ctx["TEXTURE_2D"], ctx["TEXTURE_MAG_FILTER"], ctx[magFilter]);
    ctx["texParameteri"](ctx["TEXTURE_2D"], ctx["TEXTURE_MIN_FILTER"], ctx[minFilter]);
  }