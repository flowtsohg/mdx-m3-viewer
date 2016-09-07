const M3Shaders = {
    "vs_common": `
        vec3 TBN(vec3 vector, vec3 tangent, vec3 binormal, vec3 normal) {
    vec3 transformed;

    transformed.x = dot(vector, tangent);
    transformed.y = dot(vector, binormal);
    transformed.z = dot(vector, normal);

    return transformed;
    }

vec4 decodeVector(vec4 v) {
    return ((v / 255.0) * 2.0) - 1.0;
    }

    `,

    "vs_main": `
        uniform mat4 u_mvp;
uniform mat4 u_mv;
uniform vec3 u_eyePos;
uniform vec3 u_lightPos;
uniform float u_firstBoneLookupIndex;
uniform float u_boneWeightPairsCount;

attribute vec3 a_position;
attribute vec4 a_normal;
attribute vec2 a_uv0;

#ifdef EXPLICITUV1
attribute vec2 a_uv1;
#endif
#ifdef EXPLICITUV2
attribute vec2 a_uv1, a_uv2;
#endif
#ifdef EXPLICITUV3
attribute vec2 a_uv1, a_uv2, a_uv3;
#endif

attribute vec4 a_tangent;
attribute vec4 a_bones;
attribute vec4 a_weights;

uniform vec3 u_teamColors[14];
//attribute vec3 a_teamColor;
//attribute vec3 a_tintColor;

varying vec3 v_normal;
varying vec2 v_uv[4];
varying vec3 v_lightDir;
varying vec3 v_eyeVec;
varying vec3 v_halfVec;
varying vec3 v_teamColor;
varying vec3 v_tintColor;

void transform(inout vec3 position, inout vec3 normal, inout vec3 tangent, inout vec3 binormal, vec4 bones, vec4 weights) {
    if (u_boneWeightPairsCount > 0.0) {
        mat4 bone;

        if (u_boneWeightPairsCount == 1.0) {
            bone = boneAtIndex(bones[0], 0.0);
        } else {
            bone += boneAtIndex(bones[0], 0.0) * weights[0];
            bone += boneAtIndex(bones[1], 0.0) * weights[1];
            bone += boneAtIndex(bones[2], 0.0) * weights[2];
            bone += boneAtIndex(bones[3], 0.0) * weights[3];
        }

        position = vec3(bone * vec4(position, 1.0));
        normal = mat3(bone) * normal;
        tangent = vec3(bone * vec4(tangent, 0.0));
        binormal = vec3(bone * vec4(binormal, 0.0));
    } 
}

void main() {
    vec4 decodedNormal = decodeVector(a_normal);

    vec3 position = a_position;
    vec3 normal = decodedNormal.xyz;
    vec3 tangent = vec3(decodeVector(a_tangent));
    vec3 binormal = cross(normal, tangent) * decodedNormal.w;

    transform(position, normal, tangent, binormal, a_bones +u_firstBoneLookupIndex, a_weights / 255.0);

    mat3 mv = mat3(u_mv);

    vec3 position_mv = (u_mv * vec4(position, 1)).xyz;

    vec3 n = normalize(mv * normal);
    vec3 t = normalize(mv * tangent);
    vec3 b = normalize(mv * binormal);

    vec3 lightDir = normalize(u_lightPos - position_mv);
    v_lightDir = normalize(TBN(lightDir, t, b, n));

    vec3 eyeVec = normalize(u_eyePos - position_mv);
    vec3 halfVec = normalize(eyeVec - u_lightPos);

    v_eyeVec = TBN(eyeVec, t, b, n);
    v_halfVec = TBN(halfVec, t, b, n);

    v_normal = n;

    v_uv[0] = a_uv0 / 2048.0;

    #ifdef EXPLICITUV1
    v_uv[1] = a_uv1 / 2048.0;
    #else
    v_uv[1] = vec2(0.0);
    #endif

    #ifdef EXPLICITUV2
    v_uv[1] = a_uv1 / 2048.0;
    v_uv[2] = a_uv2 / 2048.0;
    #else
    v_uv[2] = vec2(0.0);
    #endif

    #ifdef EXPLICITUV3
    v_uv[1] = a_uv1 / 2048.0;
    v_uv[2] = a_uv2 / 2048.0;
    v_uv[3] = a_uv3 / 2048.0;
    #else
    v_uv[3] = vec2(0.0);
    #endif

    //v_teamColor = u_teamColors[int(a_teamColor)];
    v_teamColor = vec3(255.0, 3.0, 3.0);
	//v_tintColor = a_tintColor;

    gl_Position = u_mvp * vec4(position, 1.0);
    }

    `,

    "ps_common": `
varying vec3 v_normal;
varying vec2 v_uv[4];
varying vec3 v_lightDir;
varying vec3 v_eyeVec;
varying vec3 v_halfVec;
varying vec3 v_teamColor;
//varying vec3 v_tintColor;

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
            result += color.a * (v_teamColor / 255.0);
        } else if (layerSettings.op == LAYEROP_TEAMCOLOR_DIFFUSE_ADD) {
            result += color.a * (v_teamColor / 255.0);
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
        //if (layerSettings.useConstantColor) {
        //  return layerSettings.constantColor;
        //}

        return texture2D(layer, getUV(layerSettings));
    }

    vec4 computeLayerColor(sampler2D layer, LayerSettings layerSettings) {
        vec4 color = sampleLayer(layer, layerSettings);

        //if (layerSettings.useMask) {
        //    result *= mask;
        //}

        vec4 result = chooseChannel(layerSettings.channels, color);

        //if (layerSettings.useAlphaFactor) {
        //    result.a *= layerSettings.multiplyAddAlpha.z;
        //}

        if (layerSettings.teamColorMode == TEAMCOLOR_DIFFUSE) {
            result = vec4(mix(v_teamColor / 255.0, result.rgb, color.a), 1.0);
        } else if (layerSettings.teamColorMode == TEAMCOLOR_EMISSIVE) {
            result = vec4(mix(v_teamColor / 255.0, result.rgb, color.a), 1.0);
        }

        if (layerSettings.invert) {
            result = vec4(1.0) - result;
        }

        //if (layerSettings.multiplyEnable) {
        //    result *= layerSettings.multiplyAddAlpha.x;
        //}

        //if (layerSettings.addEnable) {
        //    result += layerSettings.multiplyAddAlpha.y;
        //}

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

        normal.xy = 2.0 * texel.wy -1.0;
        normal.z = sqrt(max(0.0, 1.0 -dot(normal.xy, normal.xy)));

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

    `,

    "ps_main": `
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

void main() {
    vec3 color;
    vec4 final = u_lightAmbient;
    vec3 normal;
    vec3 lightMapDiffuse;

    if (u_normalLayerSettings.enabled) {
        normal = decodeNormal(u_normalMap);
    } else {
        normal = v_normal;
    }

    float lambertFactor = max(dot(normal, v_lightDir), 0.0);

    if (lambertFactor > 0.0) {
        if (u_diffuseLayerSettings.enabled) {
            vec4 diffuseColor = computeLayerColor(u_diffuseMap, u_diffuseLayerSettings);

            color = combineLayerColor(diffuseColor, color, u_diffuseLayerSettings);
    }

        if (u_decalLayerSettings.enabled) {
            vec4 decalColor = computeLayerColor(u_decalMap, u_decalLayerSettings);

            color = combineLayerColor(decalColor, color, u_decalLayerSettings);
    }

        vec4 specularColor = computeSpecular(u_specularMap, u_specularLayerSettings, u_specularity, u_specMult, normal);

        if (u_lightMapLayerSettings.enabled) {
            vec4 lightMapColor = computeLayerColor(u_lightMapMap, u_lightMapLayerSettings) * 2.0;

            lightMapDiffuse = lightMapColor.rgb;
    }

        //final.rgb = color * lightMapDiffuse + specularColor.rgb;
        final.rgb = (color +specularColor.rgb) * lambertFactor;

        bool addEmissive = false;
        vec3 emissiveColor;
        vec4 tempColor;

        if (u_emissiveLayerSettings.enabled) {
            tempColor = computeLayerColor(u_emissiveMap, u_emissiveLayerSettings);

            if (u_emissiveLayerSettings.op == LAYEROP_MOD || u_emissiveLayerSettings.op == LAYEROP_MOD2X || u_emissiveLayerSettings.op == LAYEROP_LERP) {
                final.rgb = combineLayerColor(tempColor, final.rgb, u_emissiveLayerSettings);
    } else {
                emissiveColor = combineLayerColor(tempColor, emissiveColor, u_emissiveLayerSettings);
                addEmissive = true;
    }
    }

        if (u_emissive2LayerSettings.enabled) {
            tempColor = computeLayerColor(u_emissive2Map, u_emissive2LayerSettings);

            if (!addEmissive && (u_emissive2LayerSettings.op == LAYEROP_MOD || u_emissive2LayerSettings.op == LAYEROP_MOD2X || u_emissive2LayerSettings.op == LAYEROP_LERP)) {
                final.rgb = combineLayerColor(tempColor, final.rgb, u_emissive2LayerSettings);
    } else {
                emissiveColor = combineLayerColor(tempColor, emissiveColor, u_emissive2LayerSettings);
                addEmissive = true;
    }
    }

        if (addEmissive) {
            final.rgb += emissiveColor * u_emisMult;
    }
    }

    gl_FragColor = final;
    }
    `
};
