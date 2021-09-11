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

varying vec2 v_uv;
varying float v_layerAlpha;
varying vec3 v_lightDir;
varying vec3 v_eyeVec;
varying vec3 v_normal;

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

void PBR() {
  vec3 f0 = vec3(0.04);
  vec4 baseColor = texture2D(u_diffuseMap, v_uv);
  vec4 orma = texture2D(u_ormMap, v_uv);
  vec3 emissive = texture2D(u_emissiveMap, v_uv).rgb;
  vec3 environment = texture2D(u_environmentMap, sampleEnvironmentMap(normalize(v_normal))).rgb;
  float ao = orma.r;
  float perceptualRoughness = orma.g;
  float metallic = orma.b;
  float teamColorFactor = orma.a;
  vec3 specularColor = mix(f0, baseColor.rgb, metallic);
  vec3 diffuseColor = baseColor.rgb * (vec3(1.0) - f0) * (1.0 - metallic);

  // 1bit Alpha
  if (u_filterMode == 1.0 && baseColor.a < 0.75) {
    discard;
  }

  perceptualRoughness = clamp(perceptualRoughness, 0.0, 1.0);
  metallic = clamp(metallic, 0.0, 1.0);

  float alphaRoughness = perceptualRoughness * perceptualRoughness;
  float reflectance = max(max(specularColor.r, specularColor.g), specularColor.b);
  vec3 specularEnvironmentR0 = specularColor.rgb;
  vec3 specularEnvironmentR90 = vec3(clamp(reflectance * 50.0, 0.0, 1.0));

  // vec3 color = vec3(0.0, 0.0, 0.0);
  // color += getIBLContribution(materialInfo, normal, view);

  vec3 color = diffuseColor;

  color *= ao;

  color += emissive;

  gl_FragColor = vec4(color, baseColor.a * v_layerAlpha);
}

void lambert() {
  vec4 baseColor = texture2D(u_diffuseMap, v_uv);
  vec4 orma = texture2D(u_ormMap, v_uv);
  vec3 emissive = texture2D(u_emissiveMap, v_uv).rgb;
  float ao = orma.r;
  float teamColorFactor = orma.a;

  // 1bit Alpha
  if (u_filterMode == 1.0 && baseColor.a < 0.75) {
    discard;
  }

  vec3 color = baseColor.rgb;

  if (teamColorFactor > 0.1) {
    color *= texture2D(u_teamColorMap, v_uv).rgb * teamColorFactor;
  }

  #ifndef NO_SHADING
  vec3 normal = decodeNormal();
  float lambertFactor = dot(normal, v_lightDir);
  
  color *= clamp(lambertFactor + 0.3, 0.0, 1.0);
  #endif

  color += emissive;

  gl_FragColor = vec4(color, baseColor.a * v_layerAlpha);
}

void main() {
  lambert();
}
`;

export default shader;
