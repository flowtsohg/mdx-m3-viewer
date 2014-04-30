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
  var glTypeToUniformType = [];
  var parameterMap;
  var memberMap;
  var floatPrecision = "precision mediump float;\n";
  var FLOAT_MAT2 = gl["FLOAT_MAT2"];
  var FLOAT_MAT3 = gl["FLOAT_MAT3"];
  var FLOAT_MAT4= gl["FLOAT_MAT4"];
    
  glTypeToUniformType[gl["FLOAT"]] = gl["uniform1f"].bind(gl);
  glTypeToUniformType[gl["FLOAT_VEC2"]] = gl["uniform2fv"].bind(gl);
  glTypeToUniformType[gl["FLOAT_VEC3"]] = gl["uniform3fv"].bind(gl);
  glTypeToUniformType[gl["FLOAT_VEC4"]] = gl["uniform4fv"].bind(gl);
  glTypeToUniformType[gl["INT"]] = gl["uniform1i"].bind(gl);
  glTypeToUniformType[gl["INT_VEC2"]] = gl["uniform2iv"].bind(gl);
  glTypeToUniformType[gl["INT_VEC3"]] = gl["uniform3iv"].bind(gl);
  glTypeToUniformType[gl["INT_VEC4"]] = gl["uniform4iv"].bind(gl);
  glTypeToUniformType[gl["BOOL"]] = gl["uniform1f"].bind(gl);
  glTypeToUniformType[gl["BOOL_VEC2"]] = gl["uniform2fv"].bind(gl);
  glTypeToUniformType[gl["BOOL_VEC3"]] = gl["uniform3fv"].bind(gl);
  glTypeToUniformType[gl["BOOL_VEC4"]] = gl["uniform4fv"].bind(gl);
  glTypeToUniformType[gl["FLOAT_MAT2"]] = gl["uniformMatrix2fv"].bind(gl);
  glTypeToUniformType[gl["FLOAT_MAT3"]] = gl["uniformMatrix3fv"].bind(gl);
  glTypeToUniformType[gl["FLOAT_MAT4"]] = gl["uniformMatrix4fv"].bind(gl);
  glTypeToUniformType[gl["SAMPLER_2D"]] = gl["uniform1i"].bind(gl);
  glTypeToUniformType[gl["SAMPLER_CUBE"]] = gl["uniform1i"].bind(gl);
  
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