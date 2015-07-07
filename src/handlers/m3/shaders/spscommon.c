uniform vec3 u_teamColor;

varying vec3 v_normal;
varying vec2 v_uv[4];
varying vec3 v_lightDir;
varying vec3 v_eyeVec;
varying vec3 v_halfVec;

struct LayerSettings {
    bool enabled;
    float op;
    float channels;
    float teamColorMode;
    //vec3 multAddAlpha;
    //bool useAlphaFactor;
    bool invert;
    //bool multColor;
    //bool addColor;
    bool clampResult;
    //bool useConstantColor;
    //vec4 constantColor;
    //float uvSource;
    float uvCoordinate;
    //float fresnelMode;
    //float fresnelTransformMode;
    //mat4 fresnelTransform;
    //bool fresnelClamp;
    //vec3 fresnelExponentBiasScale;
};

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
/*
float calculateFresnelTerm(vec3 normal, vec3 eyeToVertex, float exponent, mat4 fresnelTransform, float fresnelTransformMode, bool fresnelClamp) {
  vec3 fresnelDir = eyeToVertex;
  float result;
  
  if (fresnelTransformMode != FRESNELTRANSFORM_NONE) {
    fresnelDir = (fresnelTransform * vec4(fresnelDir, 1.0)).xyz;
    
    if (fresnelTransformMode == FRESNELTRANSFORM_NORMALIZED) {
      fresnelDir = normalize(fresnelDir);
    }
  }
  
  if (fresnelClamp) {
    result = 1.0 - clamp(-dot(normal, fresnelDir), 0.0, 1.0);
  } else {
    result = 1.0 - abs(dot(normal, fresnelDir));
  }
  
  result = max(result, 0.0000001);
  
  return pow(result, exponent);
}
*/
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
        result += color.a * (u_teamColor / 255.0);
    } else if (layerSettings.op == LAYEROP_TEAMCOLOR_DIFFUSE_ADD) {
        result += color.a * (u_teamColor / 255.0);
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
        return v_uv[1];
    } else if (layerSettings.uvCoordinate == 2.0) {
        return v_uv[2];
    } else if (layerSettings.uvCoordinate == 3.0) {
        return v_uv[3];
    }

    return v_uv[0];
}

vec4 sampleLayer(sampler2D layer, LayerSettings layerSettings) {
      /*
      if (layerSettings.useConstantColor && false) {
        return layerSettings.constantColor;
      }
      */
      return texture2D(layer, getUV(layerSettings));
}

vec4 computeLayerColor(sampler2D layer, LayerSettings layerSettings) {
    vec4 texel = sampleLayer(layer, layerSettings);
    vec4 result = chooseChannel(layerSettings.channels, texel);
    /*
    if (layerSettings.useAlphaFactor && false) {
    result.a *= layerSettings.multAddAlpha.z;
    }
    */
    if (layerSettings.teamColorMode == TEAMCOLOR_DIFFUSE) {
        result = vec4(mix(u_teamColor / 255.0, result.rgb, texel.a), 1);
    } else if (layerSettings.teamColorMode == TEAMCOLOR_EMISSIVE) {
        result = vec4(mix(u_teamColor / 255.0, result.rgb, texel.a), 1);
    }

    if (layerSettings.invert) {
        result = vec4(1) - result;
    }
    /*
    if (layerSettings.multColor && false) {
    result *= layerSettings.multAddAlpha.x;
    }

    if (layerSettings.addColor && false) {
    result += layerSettings.multAddAlpha.y;
    }
    */
    if (layerSettings.clampResult) {
        result = clamp(result, 0.0, 1.0);
    }
    /*
    if (layerSettings.fresnelMode != FRESNELMODE_NONE) {
    float fresnelTerm = calculateFresnelTerm(v_normal, v_eyeVec, layerSettings.fresnelExponentBiasScale.x, layerSettings.fresnelTransform, layerSettings.fresnelTransformMode, layerSettings.fresnelClamp);

    if (layerSettings.fresnelMode == FRESNELMODE_INVERTED) {
    fresnelTerm = 1.0 - fresnelTerm;
    }

    fresnelTerm = clamp(fresnelTerm * layerSettings.fresnelExponentBiasScale.z + layerSettings.fresnelExponentBiasScale.y, 0.0, 1.0);

    result *= fresnelTerm;
    }
    */
    return result;
}

vec3 decodeNormal(sampler2D map) {
    vec4 texel = texture2D(map, v_uv[0]);
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
