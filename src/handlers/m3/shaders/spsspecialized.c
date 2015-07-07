#ifdef DIFFUSE_PASS
uniform LayerSettings u_diffuseLayerSettings;
uniform sampler2D u_diffuseMap;
#endif
#ifdef UV_PASS
uniform LayerSettings u_diffuseLayerSettings;
uniform sampler2D u_diffuseMap;
#endif
#ifdef SPECULAR_PASS
uniform LayerSettings u_specularLayerSettings;
uniform sampler2D u_specularMap;
uniform float u_specularity;
uniform float u_specMult;
#endif
#ifdef HIGHRES_NORMALS
uniform LayerSettings u_normalLayerSettings;
uniform sampler2D u_normalMap;
#endif
#ifdef EMISSIVE_PASS
uniform LayerSettings u_emissiveLayerSettings;
uniform sampler2D u_emissiveMap;
uniform LayerSettings u_emissive2LayerSettings;
uniform sampler2D u_emissive2Map;
uniform float u_emisMult;
#endif
#ifdef DECAL_PASS
uniform LayerSettings u_decalLayerSettings;
uniform sampler2D u_decalMap;
#endif

void main() {
    vec4 color = vec4(0.0);
    vec3 normal;

    #ifdef HIGHRES_NORMALS
    normal = decodeNormal(u_normalMap);
    #else
    normal = v_normal;
    #endif

    #ifdef DIFFUSE_PASS
    color = computeLayerColor(u_diffuseMap, u_diffuseLayerSettings);
    #endif

    #ifdef NORMALS_PASS
    color = vec4(normal, 1);
    #endif

    #ifdef UV_PASS
    color = vec4(getUV(u_diffuseLayerSettings), 0, 1);
    #endif

    #ifdef SPECULAR_PASS
    color = computeSpecular(u_specularMap, u_specularLayerSettings, u_specularity, u_specMult, normal);
    #endif

    #ifdef EMISSIVE_PASS
    bool addEmissive = false;
    vec3 emissiveColor = vec3(0);
    vec4 tempColor;

    if (u_emissiveLayerSettings.enabled) {
        tempColor = computeLayerColor(u_emissiveMap, u_emissiveLayerSettings);

        if (u_emissiveLayerSettings.op == LAYEROP_MOD || u_emissiveLayerSettings.op == LAYEROP_MOD2X || u_emissiveLayerSettings.op == LAYEROP_LERP) {
            color.rgb = combineLayerColor(tempColor, color.rgb, u_emissiveLayerSettings);
        } else {
            emissiveColor = combineLayerColor(tempColor, emissiveColor, u_emissiveLayerSettings);
            addEmissive = true;
        }
    }

    if (u_emissive2LayerSettings.enabled) {
        tempColor = computeLayerColor(u_emissive2Map, u_emissive2LayerSettings);

        if (!addEmissive && (u_emissive2LayerSettings.op == LAYEROP_MOD || u_emissive2LayerSettings.op == LAYEROP_MOD2X || u_emissive2LayerSettings.op == LAYEROP_LERP)) {
            color.rgb = combineLayerColor(tempColor, color.rgb, u_emissive2LayerSettings);
        } else {
            emissiveColor = combineLayerColor(tempColor, emissiveColor, u_emissive2LayerSettings);
            addEmissive = true;
        }
    }

    if (addEmissive) {
        color.rgb += emissiveColor.rgb * u_emisMult;
    }
    #endif

    #ifdef UNSHADED_PASS
    float lambertFactor = max(dot(normal, v_lightDir), 0.0);

    color = vec4(lambertFactor, lambertFactor, lambertFactor, 1);
    #endif

    #ifdef DECAL_PASS
    if (u_decalLayerSettings.enabled) {
        vec4 decalColor = computeLayerColor(u_decalMap, u_decalLayerSettings);

        color.rgb = combineLayerColor(decalColor, color.rgb, u_decalLayerSettings);
        color.a = 1.0;
    }
    #endif

    #ifdef WHITE_PASS
    color = vec4(1.0);
    #endif

    gl_FragColor = color;
}
