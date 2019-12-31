const shader = `
varying vec3 v_normal;
varying vec4 v_uv[2];
varying vec3 v_lightDir;
// varying vec3 v_eyeVec;
varying vec3 v_halfVec;
varying vec3 v_teamColor;
varying vec4 v_vertexColor;

struct LayerSettings {
  bool enabled;
  float op;
  float channels;
  float teamColorMode;
  // vec3 multAddAlpha;
  // bool useAlphaFactor;
  bool invert;
  // bool multColor;
  // bool addColor;
  bool clampResult;
  // bool useConstantColor;
  // vec4 constantColor;
  // float uvSource;
  float uvCoordinate;
  // float fresnelMode;
  // float fresnelTransformMode;
  // mat4 fresnelTransform;
  // bool fresnelClamp;
  // vec3 fresnelExponentBiasScale;
};

uniform float u_specularity;
uniform float u_specMult;
uniform float u_emisMult;
uniform vec4 u_lightAmbient;

uniform LayerSettings u_diffuseLayerSettings;
uniform sampler2D u_diffuseMap;
uniform LayerSettings u_decalLayerSettings;
uniform sampler2D u_decalMap;
uniform LayerSettings u_specularLayerSettings;
uniform sampler2D u_specularMap;
uniform LayerSettings u_glossLayerSettings;
uniform sampler2D u_glossMap;
uniform LayerSettings u_emissiveLayerSettings;
uniform sampler2D u_emissiveMap;
uniform LayerSettings u_emissive2LayerSettings;
uniform sampler2D u_emissive2Map;
uniform LayerSettings u_evioLayerSettings;
uniform sampler2D u_evioMap;
uniform LayerSettings u_evioMaskLayerSettings;
uniform sampler2D u_evioMaskMap;
uniform LayerSettings u_alphaLayerSettings;
uniform sampler2D u_alphaMap;
uniform LayerSettings u_alphaMaskLayerSettings;
uniform sampler2D u_alphaMaskMap;
uniform LayerSettings u_normalLayerSettings;
uniform sampler2D u_normalMap;
uniform LayerSettings u_heightLayerSettings;
uniform sampler2D u_heightMap;
uniform LayerSettings u_lightMapLayerSettings;
uniform sampler2D u_lightMapMap;
uniform LayerSettings u_aoLayerSettings;
uniform sampler2D u_aoMap;

#define SPECULAR_RGB 0.0
#define SPECULAR_A_ONLY 1.0

#define FRESNELMODE_NONE 0.0
#define FRESNELMODE_STANDARD 1.0
#define FRESNELMODE_INVERTED 2.0

#define FRESNELTRANSFORM_NONE 0.0
#define FRESNELTRANSFORM_SIMPLE 1.0
#define FRESNELTRANSFORM_NORMALIZED 2.0

#define UVMAP_EXPLICITUV0 0.0
#define UVMAP_EXPLICITUV1 1.0
#define UVMAP_REFLECT_CUBICENVIO 2.0
#define UVMAP_REFLECT_SPHERICALENVIO 3.0
#define UVMAP_PLANARLOCALZ 4.0
#define UVMAP_PLANARWORLDZ 5.0
#define UVMAP_PARTICLE_FLIPBOOK 6.0
#define UVMAP_CUBICENVIO 7.0
#define UVMAP_SPHERICALENVIO 8.0
#define UVMAP_EXPLICITUV2 9.0
#define UVMAP_EXPLICITUV3 10.0
#define UVMAP_PLANARLOCALX 11.0
#define UVMAP_PLANARLOCALY 12.0
#define UVMAP_PLANARWORLDX 13.0
#define UVMAP_PLANARWORLDY 14.0
#define UVMAP_SCREENSPACE 15.0
#define UVMAP_TRIPLANAR_LOCAL 16.0
#define UVMAP_TRIPLANAR_WORLD 17.0
#define UVMAP_TRIPLANAR_WORLD_LOCAL_Z 18.0

#define CHANNELSELECT_RGB 0.0
#define CHANNELSELECT_RGBA 1.0
#define CHANNELSELECT_A 2.0
#define CHANNELSELECT_R 3.0
#define CHANNELSELECT_G 4.0
#define CHANNELSELECT_B 5.0

#define TEAMCOLOR_NONE 0.0
#define TEAMCOLOR_DIFFUSE 1.0
#define TEAMCOLOR_EMISSIVE 2.0

#define LAYEROP_MOD 0.0
#define LAYEROP_MOD2X 1.0
#define LAYEROP_ADD 2.0
#define LAYEROP_LERP 3.0
#define LAYEROP_TEAMCOLOR_EMISSIVE_ADD 4.0
#define LAYEROP_TEAMCOLOR_DIFFUSE_ADD 5.0
#define LAYEROP_ADD_NO_ALPHA 6.0

// float calculateFresnelTerm(vec3 normal, vec3 eyeToVertex, float exponent, mat4 fresnelTransform, float fresnelTransformMode, bool fresnelClamp) {
//   vec3 fresnelDir = eyeToVertex;
//   float result;

//   if (fresnelTransformMode != FRESNELTRANSFORM_NONE) {
//     fresnelDir = (fresnelTransform * vec4(fresnelDir, 1.0)).xyz;

//     if (fresnelTransformMode == FRESNELTRANSFORM_NORMALIZED) {
//       fresnelDir = normalize(fresnelDir);
//     }
//   }

//   if (fresnelClamp) {
//     result = 1.0 - clamp(-dot(normal, fresnelDir), 0.0, 1.0);
//   } else {
//     result = 1.0 - abs(dot(normal, fresnelDir));
//   }

//   result = max(result, 0.0000001);

//   return pow(result, exponent);
// }

vec3 combineLayerColor(vec4 color, vec3 result, LayerSettings layerSettings) {
  if (layerSettings.op == LAYEROP_MOD) {
    result *= color.rgb;
  } else if (layerSettings.op == LAYEROP_MOD2X) {
    result *= color.rgb * 2.0;
  } else if (layerSettings.op == LAYEROP_ADD) {
    result += color.rgb * color.a;
  } else if (layerSettings.op == LAYEROP_ADD_NO_ALPHA) {
    result += color.rgb;
  } else if (layerSettings.op == LAYEROP_LERP) {
    result = mix(result, color.rgb, color.a);
  } else if (layerSettings.op == LAYEROP_TEAMCOLOR_EMISSIVE_ADD) {
    result += color.a * v_teamColor;
  } else if (layerSettings.op == LAYEROP_TEAMCOLOR_DIFFUSE_ADD) {
    result += color.a * v_teamColor;
  }

  return result;
}

vec4 chooseChannel(float channel, vec4 texel) {
  if (channel == CHANNELSELECT_R) {
    texel = texel.rrrr;
  } else if (channel == CHANNELSELECT_G) {
    texel = texel.gggg;
  } else if (channel == CHANNELSELECT_B) {
    texel = texel.bbbb;
  } else if (channel == CHANNELSELECT_A) {
    texel = texel.aaaa;
  } else if (channel == CHANNELSELECT_RGB) {
    texel.a = 1.0;
  }

  return texel;
}

vec2 getUV(LayerSettings layerSettings) {
  if (layerSettings.uvCoordinate == 1.0) {
    return v_uv[0].zw;
  } else if (layerSettings.uvCoordinate == 2.0) {
    return v_uv[1].xy;
  } else if (layerSettings.uvCoordinate == 3.0) {
    return v_uv[1].zw;
  }

  return v_uv[0].xy;
}

vec4 sampleLayer(sampler2D layer, LayerSettings layerSettings) {
  // if (layerSettings.useConstantColor) {
  //   return layerSettings.constantColor;
  // }

  return texture2D(layer, getUV(layerSettings));
}

vec4 computeLayerColor(sampler2D layer, LayerSettings layerSettings) {
  vec4 color = sampleLayer(layer, layerSettings);

  // if (layerSettings.useMask) {
  //   result *= mask;
  // }

  vec4 result = chooseChannel(layerSettings.channels, color);

  // if (layerSettings.useAlphaFactor) {
  //   result.a *= layerSettings.multiplyAddAlpha.z;
  // }

  if (layerSettings.teamColorMode == TEAMCOLOR_DIFFUSE) {
    result = vec4(mix(v_teamColor, result.rgb, color.a), 1.0);
  } else if (layerSettings.teamColorMode == TEAMCOLOR_EMISSIVE) {
    result = vec4(mix(v_teamColor, result.rgb, color.a), 1.0);
  }

  if (layerSettings.invert) {
    result = vec4(1.0) - result;
  }

  // if (layerSettings.multiplyEnable) {
  //   result *= layerSettings.multiplyAddAlpha.x;
  // }

  // if (layerSettings.addEnable) {
  //   result += layerSettings.multiplyAddAlpha.y;
  // }

  if (layerSettings.clampResult) {
    result = clamp(result, 0.0, 1.0);
  }

  // if (layerSettings.fresnelMode != FRESNELMODE_NONE) {
  //   float fresnelTerm = calculateFresnelTerm(v_normal, v_eyeVec, layerSettings.fresnelExponentBiasScale.x, layerSettings.fresnelTransform, layerSettings.fresnelTransformMode, layerSettings.fresnelClamp);
    
  //   if (layerSettings.fresnelMode == FRESNELMODE_INVERTED) {
  //     fresnelTerm = 1.0 - fresnelTerm;
  //   }
    
  //   fresnelTerm = clamp(fresnelTerm * layerSettings.fresnelExponentBiasScale.z + layerSettings.fresnelExponentBiasScale.y, 0.0, 1.0);
    
  //   result *= fresnelTerm;
  // }

  return result;
}

vec3 decodeNormal(sampler2D map) {
  vec4 texel = texture2D(map, v_uv[0].xy);
  vec3 normal;

  normal.xy = 2.0 * texel.wy - 1.0;
  normal.z = sqrt(max(0.0, 1.0 - dot(normal.xy, normal.xy)));

  return normal;
}

vec4 computeSpecular(sampler2D specularMap, LayerSettings layerSettings, float specularity, float specMult, vec3 normal) {
  vec4 color;

  if (layerSettings.enabled) {
    color = computeLayerColor(specularMap, layerSettings);
  } else {
    color = vec4(0);
  }

  float factor = pow(max(-dot(v_halfVec, normal), 0.0), specularity) * specMult;

  return color * factor;
}
`;

export default shader;
