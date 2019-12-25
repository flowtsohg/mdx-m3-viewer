#extension GL_OES_standard_derivatives : enable

#ifdef USE_TEX_LOD
  #extension GL_EXT_shader_texture_lod: enable
#endif

#ifdef USE_HDR
  #extension GL_OES_texture_float : enable
  #extension GL_OES_texture_float_linear : enable
#endif

precision mediump float;

#pragma glslify: import(./textures.glsl)
#pragma glslify: import(./functions.glsl)
#pragma glslify: import(./lighting.glsl)
#pragma glslify: import(./tonemapping.glsl)

#if defined(MATERIAL_SPECULARGLOSSINESS) || defined(MATERIAL_METALLICROUGHNESS)
  uniform vec4 u_baseColorFactor;
  uniform float u_metallicFactor;
  uniform float u_roughnessFactor;
#endif

#ifdef MATERIAL_SPECULARGLOSSINESS
  uniform vec4 u_diffuseFactor;
  uniform vec3 u_specularFactor;
  uniform float u_glossinessFactor;
#endif

#ifdef ALPHAMODE_MASK
  uniform float u_alphaCutoff;
#endif

void main() {
  float perceptualRoughness = 0.0;
  float metallic = 0.0;
  vec4 baseColor = vec4(0.0, 0.0, 0.0, 1.0);
  vec3 diffuseColor = vec3(0.0);
  vec3 specularColor = vec3(0.0);
  vec3 f0 = vec3(0.04);

  #ifdef MATERIAL_METALLICROUGHNESS
    #ifdef HAS_METALLIC_ROUGHNESS_MAP
      vec4 mrSample = texture2D(u_metallicRoughnessSampler, getMetallicRoughnessUv());
      perceptualRoughness = mrSample.g * u_roughnessFactor;
      metallic = mrSample.b * u_metallicFactor;
    #else
      metallic = u_metallicFactor;
      perceptualRoughness = u_roughnessFactor;
    #endif

    #ifdef HAS_BASE_COLOR_MAP
      baseColor = SRGBtoLINEAR(texture2D(u_baseColorSampler, getBaseColorUv())) * u_baseColorFactor;
    #else
      baseColor = u_baseColorFactor;
    #endif

    baseColor *= getVertexColor();
    specularColor = mix(f0, baseColor.rgb, metallic);
    diffuseColor = baseColor.rgb * (vec3(1.0) - f0) * (1.0 - metallic);
  #endif 

  #ifdef MATERIAL_SPECULARGLOSSINESS
    #ifdef HAS_SPECULAR_GLOSSINESS_MAP
      vec4 sgSample = SRGBtoLINEAR(texture2D(u_specularGlossinessSampler, getSpecularGlossinessUv()));
      perceptualRoughness = (1.0 - sgSample.a * u_glossinessFactor);
      f0 = sgSample.rgb * u_specularFactor;
    #else
      f0 = u_specularFactor;
      perceptualRoughness = 1.0 - u_glossinessFactor;
    #endif

    #ifdef HAS_DIFFUSE_MAP
      baseColor = SRGBtoLINEAR(texture2D(u_diffuseSampler, getDiffuseUv())) * u_diffuseFactor;
    #else
      baseColor = u_diffuseFactor;
    #endif

    baseColor *= getVertexColor();
    specularColor = f0;
    diffuseColor = baseColor.rgb * (1.0 - max(max(f0.r, f0.g), f0.b));
  #endif

  #ifdef ALPHAMODE_OPAQUE
    baseColor.a = 1.0;
  #endif

  #ifdef ALPHAMODE_MASK
    if(baseColor.a < u_alphaCutoff) {
        discard;
    }

    baseColor.a = 1.0;
  #endif

  #ifdef MATERIAL_UNLIT
    gl_FragColor = vec4(LINEARtoSRGB(baseColor.rgb), baseColor.a);

    return;
  #endif

  perceptualRoughness = clamp(perceptualRoughness, 0.0, 1.0);
  metallic = clamp(metallic, 0.0, 1.0);

  float alphaRoughness = perceptualRoughness * perceptualRoughness;
  float reflectance = max(max(specularColor.r, specularColor.g), specularColor.b);
  vec3 specularEnvironmentR0 = specularColor.rgb;
  vec3 specularEnvironmentR90 = vec3(clamp(reflectance * 50.0, 0.0, 1.0));

  MaterialInfo materialInfo = MaterialInfo(
    perceptualRoughness,
    specularEnvironmentR0,
    alphaRoughness,
    diffuseColor,
    specularEnvironmentR90,
    specularColor
  );

  vec3 color = vec3(0.0, 0.0, 0.0);
  vec3 normal = getNormal();
  vec3 view = normalize(u_camera - v_position);

  #ifdef USE_PUNCTUAL
    for (int i = 0; i < LIGHT_COUNT; ++i) {
      Light light = u_Lights[i];

      if (light.type == LightType_Directional) {
          color += applyDirectionalLight(light, materialInfo, normal, view);
      } else if (light.type == LightType_Point) {
          color += applyPointLight(light, materialInfo, normal, view);
      } else if (light.type == LightType_Spot) {
          color += applySpotLight(light, materialInfo, normal, view);
      }
    }
  #endif

  #ifdef USE_ENV
    if (u_hasEnvSamplers) {
      color += getIBLContribution(materialInfo, normal, view);
    } else {
      color += materialInfo.diffuseColor;
    }
  #endif

  float ao = 1.0;
  #ifdef HAS_OCCLUSION_MAP
    ao = texture2D(u_occlusionSampler, getOcclusionUv()).r;
    color = mix(color, color * ao, u_occlusionStrength);
  #endif

  vec3 emissive = vec3(0);
  #ifdef HAS_EMISSIVE_MAP
    emissive = SRGBtoLINEAR(texture2D(u_emissiveSampler, getEmissiveUv())).rgb * u_emissiveFactor;
    color += emissive;
  #endif
  
  #ifndef DEBUG_OUTPUT
    gl_FragColor = vec4(toneMap(color), baseColor.a);
  #else
    #ifdef DEBUG_METALLIC
      gl_FragColor.rgb = vec3(metallic);
    #endif

    #ifdef DEBUG_ROUGHNESS
      gl_FragColor.rgb = vec3(perceptualRoughness);
    #endif

    #ifdef DEBUG_NORMAL
      #ifdef HAS_NORMAL_MAP
        gl_FragColor.rgb = texture2D(u_normalSampler, getNormalUV()).rgb;
      #else
        gl_FragColor.rgb = normal;
      #endif
    #endif

    #ifdef DEBUG_BASECOLOR
      gl_FragColor.rgb = LINEARtoSRGB(baseColor.rgb);
    #endif

    #ifdef DEBUG_OCCLUSION
      gl_FragColor.rgb = vec3(ao);
    #endif

    #ifdef DEBUG_EMISSIVE
      gl_FragColor.rgb = LINEARtoSRGB(emissive);
    #endif

    #ifdef DEBUG_F0
      gl_FragColor.rgb = vec3(f0);
    #endif

    #ifdef DEBUG_ALPHA
      gl_FragColor.rgb = vec3(baseColor.a);
    #endif

    gl_FragColor.a = 1.0;
  #endif
}
