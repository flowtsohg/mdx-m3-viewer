function GL(element, onload, onerror, onprogress, onloadstart, unboundonerror) {
  var gl;
  var identifiers = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  
  for (var i = 0, l = identifiers.length; i < l; ++i) {
    try {
      gl = element.getContext(identifiers[i], {antialias: true, alpha: false});
    } catch(e) {}

    if (gl) {
      break;
    }
  }
  
  if (!gl) {
    unboundonerror({isGL: true}, "WebGLContext");
    return;
  }
  
  var hasVertexTexture = gl["getParameter"](gl["MAX_VERTEX_TEXTURE_IMAGE_UNITS"]) > 0;
  var hasFloatTexture = gl["getExtension"]("OES_texture_float");
  var compressedTextures = gl["getExtension"]("WEBGL_compressed_texture_s3tc");
  var instancedArrays = gl["getExtension"]("ANGLE_instanced_arrays");
  var hasInstancedDraw = !!instancedArrays;
  
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
  
  var projectionMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  var viewMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  var mvpMatrix = [];
  var matrixStack = [];
  var textureStore = {};
  var shaderUnitStore = {};
  var shaderStore = {};
  var shaderUniformStore = {};
  var boundShader;
  var boundShaderName = "";
  var boundTextures = [];
  var glTypeToUniformType = {};
  var parameterMap;
  var memberMap;
  var floatPrecision = "precision mediump float;\n";
    
  glTypeToUniformType[gl["FLOAT"]] = "1f";
  glTypeToUniformType[gl["FLOAT_VEC2"]] = "2fv";
  glTypeToUniformType[gl["FLOAT_VEC3"]] = "3fv";
  glTypeToUniformType[gl["FLOAT_VEC4"]] = "4fv";
  glTypeToUniformType[gl["INT"]] = "1i";
  glTypeToUniformType[gl["INT_VEC2"]] = "2iv";
  glTypeToUniformType[gl["INT_VEC3"]] = "3iv";
  glTypeToUniformType[gl["INT_VEC4"]] = "4iv";
  glTypeToUniformType[gl["BOOL"]] = "1f";
  glTypeToUniformType[gl["BOOL_VEC2"]] = "2fv";
  glTypeToUniformType[gl["BOOL_VEC3"]] = "3fv";
  glTypeToUniformType[gl["BOOL_VEC4"]] = "4fv";
  glTypeToUniformType[gl["FLOAT_MAT2"]] = "Matrix2fv";
  glTypeToUniformType[gl["FLOAT_MAT3"]] = "Matrix3fv";
  glTypeToUniformType[gl["FLOAT_MAT4"]] = "Matrix4fv";
  glTypeToUniformType[gl["SAMPLER_2D"]] = "1i";
  glTypeToUniformType[gl["SAMPLER_CUBE"]] = "1i";
  
  gl["viewport"](0, 0, element.clientWidth, element.clientHeight);
  gl["depthFunc"](gl["LEQUAL"]);
  gl["enable"](gl["DEPTH_TEST"]);
  gl["enable"](gl["CULL_FACE"]);
  
  function textureOptions(wrapS, wrapT, magFilter, minFilter) {
    gl["texParameteri"](gl["TEXTURE_2D"], gl["TEXTURE_WRAP_S"], gl[wrapS]);
    gl["texParameteri"](gl["TEXTURE_2D"], gl["TEXTURE_WRAP_T"], gl[wrapT]);
    gl["texParameteri"](gl["TEXTURE_2D"], gl["TEXTURE_MAG_FILTER"], gl[magFilter]);
    gl["texParameteri"](gl["TEXTURE_2D"], gl["TEXTURE_MIN_FILTER"], gl[minFilter]);
  }