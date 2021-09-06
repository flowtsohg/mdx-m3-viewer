import precision from '../../shaders/precision.glsl';

const shader = `
${precision}

uniform bool u_debugNoShading;

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
varying vec3 v_halfVec;

vec3 decodeNormal() {
  vec2 xy = texture2D(u_normalsMap, v_uv).xy * 2.0 - 1.0;
  
  return vec3(xy, sqrt(1.0 - dot(xy, xy)));
}

void main() {
  vec4 texel = texture2D(u_diffuseMap, v_uv);
  vec4 color = vec4(texel.rgb, texel.a * v_layerAlpha);

  if (!u_debugNoShading) {
    vec3 normal = decodeNormal();
    float lambertFactor = dot(normal, v_lightDir);

    color.rgb *= clamp(lambertFactor + 0.1, 0.0, 1.0);
  }

  vec4 orma = texture2D(u_ormMap, v_uv);

  if (orma.a > 0.1) {
    color.rgb *= texture2D(u_teamColorMap, v_uv).rgb * orma.a;
  }

  color.rgb += texture2D(u_emissiveMap, v_uv).rgb;

  // 1bit Alpha
  if (u_filterMode == 1.0 && color.a < 0.75) {
    discard;
  }

  gl_FragColor = color;
}
`;

export default shader;
