struct MaterialInfo {
  float perceptualRoughness;
  vec3 reflectance0;
  float alphaRoughness;
  vec3 diffuseColor;
  vec3 reflectance90;
  vec3 specularColor;
};

struct Light {
  vec3 direction;
  float range;
  vec3 color;
  float intensity;
  vec3 position;
  float innerConeCos;
  float outerConeCos;
  int type;
  vec2 padding;
};

const int LightType_Directional = 0;
const int LightType_Point = 1;
const int LightType_Spot = 2;

#ifdef USE_PUNCTUAL
  uniform Light u_Lights[LIGHT_COUNT];
#endif

uniform vec3 u_camera;

#ifdef USE_TEX_LOD
  uniform int u_mipCount;
#endif

#ifdef USE_ENV
  vec3 getIBLContribution(MaterialInfo materialInfo, vec3 n, vec3 v) {
    float NdotV = clamp(dot(n, v), 0.0, 1.0);
    vec3 reflection = normalize(reflect(-v, n));
    vec2 brdfSamplePoint = clamp(vec2(NdotV, materialInfo.perceptualRoughness), vec2(0.0, 0.0), vec2(1.0, 1.0));
    vec2 brdf = texture2D(u_brdfLUT, brdfSamplePoint).rg;
    vec4 diffuseSample = textureCube(u_diffuseEnvSampler, n);

    #ifdef USE_TEX_LOD
      float lod = clamp(materialInfo.perceptualRoughness * float(u_mipCount), 0.0, float(u_mipCount));

      vec4 specularSample = textureCubeLodEXT(u_specularEnvSampler, reflection, lod);
    #else
      vec4 specularSample = textureCube(u_specularEnvSampler, reflection);
    #endif

    #ifdef USE_HDR
      vec3 diffuseLight = diffuseSample.rgb;
      vec3 specularLight = specularSample.rgb;
    #else
      vec3 diffuseLight = SRGBtoLINEAR(diffuseSample).rgb;
      vec3 specularLight = SRGBtoLINEAR(specularSample).rgb;
    #endif

    vec3 diffuse = diffuseLight * materialInfo.diffuseColor;
    vec3 specular = specularLight * (materialInfo.specularColor * brdf.x + brdf.y);

    return diffuse + specular;
  }
#endif

vec3 diffuse(MaterialInfo materialInfo) {
  return materialInfo.diffuseColor / M_PI;
}

vec3 specularReflection(MaterialInfo materialInfo, float VdotH) {
  return materialInfo.reflectance0 + (materialInfo.reflectance90 - materialInfo.reflectance0) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);
}

float visibilityOcclusion(MaterialInfo materialInfo, float NdotL, float NdotV) {
  float alphaRoughnessSq = materialInfo.alphaRoughness * materialInfo.alphaRoughness;
  float GGXV = NdotL * sqrt(NdotV * NdotV * (1.0 - alphaRoughnessSq) + alphaRoughnessSq);
  float GGXL = NdotV * sqrt(NdotL * NdotL * (1.0 - alphaRoughnessSq) + alphaRoughnessSq);
  float GGX = GGXV + GGXL;

  if (GGX > 0.0) {
    return 0.5 / GGX;
  }

  return 0.0;
}

float microfacetDistribution(MaterialInfo materialInfo, float NdotH) {
  float alphaRoughnessSq = materialInfo.alphaRoughness * materialInfo.alphaRoughness;
  float f = (NdotH * alphaRoughnessSq - NdotH) * NdotH + 1.0;

  return alphaRoughnessSq / (M_PI * f * f);
}

vec3 getPointShade(vec3 pointToLight, MaterialInfo materialInfo, vec3 normal, vec3 view) {
  vec3 n = normalize(normal);
  vec3 v = normalize(view);
  vec3 l = normalize(pointToLight);
  vec3 h = normalize(l + v);
  float NdotL = clamp(dot(n, l), 0.0, 1.0);
  float NdotV = clamp(dot(n, v), 0.0, 1.0);
  float NdotH = clamp(dot(n, h), 0.0, 1.0);
  float VdotH = clamp(dot(v, h), 0.0, 1.0);

  if (NdotL > 0.0 || NdotV > 0.0) {
    vec3 F = specularReflection(materialInfo, VdotH);
    float Vis = visibilityOcclusion(materialInfo, NdotL, NdotV);
    float D = microfacetDistribution(materialInfo, NdotH);
    vec3 diffuseContrib = (1.0 - F) * diffuse(materialInfo);
    vec3 specContrib = F * Vis * D;

    return NdotL * (diffuseContrib + specContrib);
  }

  return vec3(0.0, 0.0, 0.0);
}

float getRangeAttenuation(float range, float distance) {
  if (range <= 0.0) {
    return 1.0;
  }

  return max(min(1.0 - pow(distance / range, 4.0), 1.0), 0.0) / pow(distance, 2.0);
}

float getSpotAttenuation(vec3 pointToLight, vec3 spotDirection, float outerConeCos, float innerConeCos) {
  float actualCos = dot(normalize(spotDirection), normalize(-pointToLight));

  if (actualCos > outerConeCos) {
    if (actualCos < innerConeCos) {
      return smoothstep(outerConeCos, innerConeCos, actualCos);
    }

    return 1.0;
  }

  return 0.0;
}

vec3 applyDirectionalLight(Light light, MaterialInfo materialInfo, vec3 normal, vec3 view) {
  vec3 pointToLight = -light.direction;
  vec3 shade = getPointShade(pointToLight, materialInfo, normal, view);

  return light.intensity * light.color * shade;
}

vec3 applyPointLight(Light light, MaterialInfo materialInfo, vec3 normal, vec3 view) {
  vec3 pointToLight = light.position - v_position;
  float distance = length(pointToLight);
  float attenuation = getRangeAttenuation(light.range, distance);
  vec3 shade = getPointShade(pointToLight, materialInfo, normal, view);

  return attenuation * light.intensity * light.color * shade;
}

vec3 applySpotLight(Light light, MaterialInfo materialInfo, vec3 normal, vec3 view) {
  vec3 pointToLight = light.position - v_position;
  float distance = length(pointToLight);
  float rangeAttenuation = getRangeAttenuation(light.range, distance);
  float spotAttenuation = getSpotAttenuation(pointToLight, light.direction, light.outerConeCos, light.innerConeCos);
  vec3 shade = getPointShade(pointToLight, materialInfo, normal, view);

  return rangeAttenuation * spotAttenuation * light.intensity * light.color * shade;
}
