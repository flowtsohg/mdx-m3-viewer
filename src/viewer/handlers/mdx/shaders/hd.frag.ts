import precision from '../../shaders/precision.glsl';

const shader = `
${precision}

uniform sampler2D u_diffuseMap;
uniform sampler2D u_normalsMap;
uniform sampler2D u_ormMap;
uniform sampler2D u_emissiveMap;
uniform sampler2D u_teamColorMap;
uniform sampler2D u_environmentMap;
uniform float u_filterMode;

// uniform sampler2D u_lutMap;
// uniform sampler2D u_envDiffuseMap;
// uniform sampler2D u_envSpecularMap;

varying vec2 v_uv;
varying float v_layerAlpha;
varying vec3 v_lightDir;
varying vec3 v_eyeVec;
varying vec3 v_normal;
// varying vec3 v_lightDirWorld;

#if defined(ONLY_TANGENTS)
varying vec3 v_tangent;
#endif

vec3 decodeNormal() {
  vec2 xy = texture2D(u_normalsMap, v_uv).xy * 2.0 - 1.0;
  
  return vec3(xy, sqrt(1.0 - dot(xy, xy)));
}

const vec2 invAtan = vec2(0.1591, 0.3183);
vec2 sampleEnvironmentMap(vec3 normal) {
  vec2 uv = vec2(atan(normal.x, normal.y), -asin(normal.z));
  uv *= invAtan;
  uv += 0.5;
  return uv;
}

vec4 getDiffuseColor() {
  vec4 color = texture2D(u_diffuseMap, v_uv);

  // 1bit Alpha
  if (u_filterMode == 1.0 && color.a < 0.75) {
    discard;
  }

  return color;
}

vec4 getOrmColor() {
  return texture2D(u_ormMap, v_uv);
}

vec3 getEmissiveColor() {
  return texture2D(u_emissiveMap, v_uv).rgb;
}

vec3 getTeamColor() {
  return texture2D(u_teamColorMap, v_uv).rgb;
}

// const float PI = 3.14159265359;
// const float RECIPROCAL_PI = 0.31830988618;
// const float RECIPROCAL_PI2 = 0.15915494;
// const float LN2 = 0.6931472;
// const float ENV_LODS = 6.0;
// vec4 SRGBtoLinear(vec4 srgb) {
//     vec3 linOut = pow(srgb.xyz, vec3(2.2));
//     return vec4(linOut, srgb.w);;
// }
// vec4 RGBMToLinear(in vec4 value) {
//     float maxRange = 6.0;
//     return vec4(value.xyz * value.w * maxRange, 1.0);
// }
// vec3 linearToSRGB(vec3 color) {
//     return pow(color, vec3(1.0 / 2.2));
// }
// // vec3 getNormal() {
// //     vec3 pos_dx = dFdx(vMPos.xyz);
// //     vec3 pos_dy = dFdy(vMPos.xyz);
// //     vec2 tex_dx = dFdx(vUv);
// //     vec2 tex_dy = dFdy(vUv);
// //     vec3 t = normalize(pos_dx * tex_dy.t - pos_dy * tex_dx.t);
// //     vec3 b = normalize(-pos_dx * tex_dy.s + pos_dy * tex_dx.s);
// //     mat3 tbn = mat3(t, b, normalize(vNormal));
// //     vec3 n = texture2D(tNormal, vUv * uNormalUVScale).rgb * 2.0 - 1.0;
// //     n.xy *= uNormalScale;
// //     vec3 normal = normalize(tbn * n);
// //     // Get world normal from view normal (normalMatrix * normal)
// //     return normalize((vec4(normal, 0.0) * viewMatrix).xyz);
// // }
// vec3 specularReflection(vec3 specularEnvR0, vec3 specularEnvR90, float VdH) {
//     return specularEnvR0 + (specularEnvR90 - specularEnvR0) * pow(clamp(1.0 - VdH, 0.0, 1.0), 5.0);
// }
// float geometricOcclusion(float NdL, float NdV, float roughness) {
//     float r = roughness;
//     float attenuationL = 2.0 * NdL / (NdL + sqrt(r * r + (1.0 - r * r) * (NdL * NdL)));
//     float attenuationV = 2.0 * NdV / (NdV + sqrt(r * r + (1.0 - r * r) * (NdV * NdV)));
//     return attenuationL * attenuationV;
// }
// float microfacetDistribution(float roughness, float NdH) {
//     float roughnessSq = roughness * roughness;
//     float f = (NdH * roughnessSq - NdH) * NdH + 1.0;
//     return roughnessSq / (PI * f * f);
// }
// vec2 cartesianToPolar(vec3 n) {
//     vec2 uv;
//     uv.x = atan(n.z, n.x) * RECIPROCAL_PI2 + 0.5;
//     uv.y = asin(n.y) * RECIPROCAL_PI + 0.5;
//     return uv;
// }
// void getIBLContribution(inout vec3 diffuse, inout vec3 specular, float NdV, float roughness, vec3 n, vec3 reflection, vec3 diffuseColor, vec3 specularColor) {
//   vec3 brdf = SRGBtoLinear(texture2D(u_lutMap, vec2(NdV, roughness))).rgb;
//   vec3 diffuseLight = RGBMToLinear(texture2D(u_envDiffuseMap, sampleEnvironmentMap(n))).rgb;
//   // Sample 2 levels and mix between to get smoother degradation
//   float blend = roughness * ENV_LODS;
//   float level0 = floor(blend);
//   float level1 = min(ENV_LODS, level0 + 1.0);
//   blend -= level0;
  
//   // Sample the specular env map atlas depending on the roughness value
//   vec2 uvSpec = sampleEnvironmentMap(reflection);
//   uvSpec.y /= 2.0;
//   vec2 uv0 = uvSpec;
//   vec2 uv1 = uvSpec;
//   uv0 /= pow(2.0, level0);
//   uv0.y += 1.0 - exp(-LN2 * level0);
//   uv1 /= pow(2.0, level1);
//   uv1.y += 1.0 - exp(-LN2 * level1);
//   vec3 specular0 = RGBMToLinear(texture2D(u_envSpecularMap, uv0)).rgb;
//   vec3 specular1 = RGBMToLinear(texture2D(u_envSpecularMap, uv1)).rgb;
//   vec3 specularLight = mix(specular0, specular1, blend);
//   diffuse = diffuseLight * diffuseColor;
  
//   // Bit of extra reflection for smooth materials
//   float reflectivity = pow((1.0 - roughness), 2.0) * 0.05;
//   specular = specularLight * (specularColor * brdf.x + brdf.y + reflectivity);
//   // specular *= uEnvSpecular;
// }

// void PBR() {
//   vec4 baseDiffuseColor = getDiffuseColor();
//   vec3 baseColor = baseDiffuseColor.rgb;
//   vec4 orm = getOrmColor();
//   vec3 tc = getTeamColor();
//   float tcFactor = getOrmColor().a;

//   if (tcFactor > 0.1) {
//     baseColor *= tc * tcFactor;
//   }

//   float roughness = clamp(orm.g, 0.04, 1.0);
//   float metallic = clamp(orm.b, 0.04, 1.0);

//   vec3 f0 = vec3(0.04);
//   vec3 diffuseColor = baseColor * (vec3(1.0) - f0) * (1.0 - metallic);
//   vec3 specularColor = mix(f0, baseColor, metallic);
//   vec3 specularEnvR0 = specularColor;
//   vec3 specularEnvR90 = vec3(clamp(max(max(specularColor.r, specularColor.g), specularColor.b) * 25.0, 0.0, 1.0));

//   vec3 N = v_normal;
//   vec3 V = normalize(v_eyeVec);
//   vec3 L = normalize(v_lightDirWorld);
//   vec3 H = normalize(L + V);
//   vec3 reflection = normalize(reflect(-V, N));

//   float NdL = clamp(dot(N, L), 0.001, 1.0);
//   float NdV = clamp(abs(dot(N, V)), 0.001, 1.0);
//   float NdH = clamp(dot(N, H), 0.0, 1.0);
//   float LdH = clamp(dot(L, H), 0.0, 1.0);
//   float VdH = clamp(dot(V, H), 0.0, 1.0);

//   vec3 F = specularReflection(specularEnvR0, specularEnvR90, VdH);
//   float G = geometricOcclusion(NdL, NdV, roughness);
//   float D = microfacetDistribution(roughness, NdH);

//   vec3 diffuseContrib = (1.0 - F) * (diffuseColor / PI);
//   vec3 specContrib = F * G * D / (4.0 * NdL * NdV);
  
//   // Shading based off lights
//   // vec3 color = NdL * uLightColor * (diffuseContrib + specContrib);
//   vec3 color = NdL * (diffuseContrib + specContrib);

//   // Calculate IBL lighting
//   vec3 diffuseIBL;
//   vec3 specularIBL;
//   getIBLContribution(diffuseIBL, specularIBL, NdV, roughness, N, reflection, diffuseColor, specularColor);

//   // Add IBL on top of color
//   color +=  specularIBL;

//   color *= orm.r;

//   color += getEmissiveColor();

//   // Convert to sRGB to display
//   gl_FragColor.rgb = color;
//   gl_FragColor.a = baseDiffuseColor.a;
// }

void onlyDiffuse() {
  vec4 baseColor = getDiffuseColor();
  vec3 tc = getTeamColor();
  float tcFactor = getOrmColor().a;

  if (tcFactor > 0.1) {
    baseColor.rgb *= tc * tcFactor;
  }

  gl_FragColor = baseColor;
}

void onlyNormalMap() {
  gl_FragColor = vec4(decodeNormal(), 1.0);
}

void onlyOcclusion() {
  gl_FragColor = vec4(getOrmColor().rrr, 1.0);
}

void onlyRoughness() {
  gl_FragColor = vec4(getOrmColor().ggg, 1.0);
}

void onlyMetallic() {
  gl_FragColor = vec4(getOrmColor().bbb, 1.0);
}

void onlyTeamColorFactor() {
  gl_FragColor = vec4(getOrmColor().aaa, 1.0);
}

void onlyEmissiveMap() {
  gl_FragColor = vec4(getEmissiveColor(), 1.0);
}

void onlyTexCoords() {
  gl_FragColor = vec4(v_uv, 0.0, 1.0);
}

void onlyNormals() {
  gl_FragColor = vec4(v_normal, 1.0);
}

#if defined(ONLY_TANGENTS)
void onlyTangents() {
  gl_FragColor = vec4(v_tangent, 1.0);
}
#endif

void lambert() {
  vec4 baseColor = getDiffuseColor();
  vec3 normal = decodeNormal();
  vec4 orm = getOrmColor();
  vec3 emissive = getEmissiveColor();
  vec3 tc = getTeamColor();
  float aoFactor = orm.r;
  float tcFactor = orm.a;
  float lambertFactor = clamp(dot(normal, v_lightDir), 0.0, 1.0);
  vec3 color = baseColor.rgb;

  if (tcFactor > 0.1) {
    color *= tc * tcFactor;
  }
  
  color *= clamp(lambertFactor * aoFactor + 0.1, 0.0, 1.0);
  color += emissive;

  gl_FragColor = vec4(color, baseColor.a);
}

void main() {
  #if defined(ONLY_DIFFUSE)
  onlyDiffuse();
  #elif defined(ONLY_NORMAL_MAP)
  onlyNormalMap();
  #elif defined(ONLY_OCCLUSION)
  onlyOcclusion();
  #elif defined(ONLY_ROUGHNESS)
  onlyRoughness();
  #elif defined(ONLY_METALLIC)
  onlyMetallic();
  #elif defined(ONLY_TC_FACTOR)
  onlyTeamColorFactor();
  #elif defined(ONLY_EMISSIVE)
  onlyEmissiveMap();
  #elif defined(ONLY_TEXCOORDS)
  onlyTexCoords();
  #elif defined(ONLY_NORMALS)
  onlyNormals();
  #elif defined(ONLY_TANGENTS)
  onlyTangents();
  #else
  lambert();
  #endif
}
`;

export default shader;
