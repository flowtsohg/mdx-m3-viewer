const shader = `
varying vec2 v_uvCoord0;
varying vec2 v_uvCoord1;

#ifdef HAS_NORMAL_MAP
  uniform sampler2D u_normalSampler;
  uniform int u_normalUvSet;
  uniform float u_normalScale;
  uniform mat3 u_normalUvTransform;
#endif

#ifdef HAS_EMISSIVE_MAP
  uniform sampler2D u_emissiveSampler;
  uniform int u_emissiveUvSet;
  uniform vec3 u_emissiveFactor;
  uniform mat3 u_emissiveUvTransform;
#endif

#ifdef HAS_OCCLUSION_MAP
  uniform sampler2D u_occlusionSampler;
  uniform int u_occlusionUvSet;
  uniform float u_occlusionStrength;
  uniform mat3 u_occlusionUvTransform;
#endif

#ifdef HAS_BASE_COLOR_MAP
  uniform sampler2D u_baseColorSampler;
  uniform int u_baseColorUvSet;
  uniform mat3 u_baseColorUvTransform;
#endif

#ifdef HAS_METALLIC_ROUGHNESS_MAP
  uniform sampler2D u_metallicRoughnessSampler;
  uniform int u_metallicRoughnessUvSet;
  uniform mat3 u_metallicRoughnessUvTransform;
#endif

#ifdef HAS_DIFFUSE_MAP
  uniform sampler2D u_diffuseSampler;
  uniform int u_diffuseUvSet;
  uniform mat3 u_diffuseUvTransform;
#endif

#ifdef HAS_SPECULAR_GLOSSINESS_MAP
  uniform sampler2D u_specularGlossinessSampler;
  uniform int u_specularGlossinessUvSet;
  uniform mat3 u_specularGlossinessUvTransform;
#endif

#ifdef USE_ENV
  uniform bool u_hasEnvSamplers;
  uniform samplerCube u_diffuseEnvSampler;
  uniform samplerCube u_specularEnvSampler;
  uniform sampler2D u_brdfLUT;
#endif

vec2 getUvCoord(int set) {
  if (set < 1) {
    return v_uvCoord0;
  }

  return v_uvCoord1;
}

vec2 getNormalUv() {
  vec3 uv = vec3(v_uvCoord0, 1.0);

  #ifdef HAS_NORMAL_MAP
    uv.xy = getUvCoord(u_normalUvSet);

    #ifdef HAS_NORMAL_UV_TRANSFORM
      uv *= u_normalUvTransform;
    #endif
  #endif

  return uv.xy;
}

vec2 getEmissiveUv() {
  vec3 uv = vec3(v_uvCoord0, 1.0);

  #ifdef HAS_EMISSIVE_MAP
    uv.xy = getUvCoord(u_emissiveUvSet);

    #ifdef HAS_EMISSIVE_UV_TRANSFORM
      uv *= u_emissiveUvTransform;
    #endif
  #endif

  return uv.xy;
}

vec2 getOcclusionUv() {
  vec3 uv = vec3(v_uvCoord0, 1.0);

  #ifdef HAS_OCCLUSION_MAP
    uv.xy = getUvCoord(u_occlusionUvSet);

    #ifdef HAS_OCCLSION_UV_TRANSFORM
      uv *= u_occlusionUvTransform;
    #endif
  #endif

  return uv.xy;
}

vec2 getBaseColorUv() {
  vec3 uv = vec3(v_uvCoord0, 1.0);

  #ifdef HAS_BASE_COLOR_MAP
    uv.xy = getUvCoord(u_baseColorUvSet);

    #ifdef HAS_BASECOLOR_UV_TRANSFORM
      uv *= u_baseColorUvTransform;
    #endif
  #endif

  return uv.xy;
}

vec2 getMetallicRoughnessUv() {
  vec3 uv = vec3(v_uvCoord0, 1.0);

  #ifdef HAS_METALLIC_ROUGHNESS_MAP
    uv.xy = getUvCoord(u_metallicRoughnessUvSet);

    #ifdef HAS_METALLICROUGHNESS_UV_TRANSFORM
      uv *= u_metallicRoughnessUvTransform;
    #endif
  #endif

  return uv.xy;
}

vec2 getSpecularGlossinessUv() {
  vec3 uv = vec3(v_uvCoord0, 1.0);

  #ifdef HAS_SPECULAR_GLOSSINESS_MAP
    uv.xy = getUvCoord(u_specularGlossinessUvSet);

    #ifdef HAS_SPECULARGLOSSINESS_UV_TRANSFORM
      uv *= u_specularGlossinessUvTransform;
    #endif
  #endif

  return uv.xy;
}

vec2 getDiffuseUv() {
  vec3 uv = vec3(v_uvCoord0, 1.0);

  #ifdef HAS_DIFFUSE_MAP
    uv.xy = getUvCoord(u_diffuseUvSet);

    #ifdef HAS_DIFFUSE_UV_TRANSFORM
      uv *= u_diffuseUvTransform;
    #endif
  #endif

  return uv.xy;
}
`;

export default shader;
