import layers from './layers.glsl';

const shader = `
precision mediump float;

${layers}

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

    // final.rgb = color * lightMapDiffuse + specularColor.rgb;
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

  gl_FragColor = final * v_vertexColor;
}
`;

export default shader;
