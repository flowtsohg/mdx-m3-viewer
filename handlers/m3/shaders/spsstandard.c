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
        final.rgb = (color + specularColor.rgb) * lambertFactor;

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
