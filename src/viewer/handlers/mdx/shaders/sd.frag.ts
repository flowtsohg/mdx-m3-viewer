import precision from '../../shaders/precision.glsl';
import quatTransform from '../../shaders/quattransform.glsl';

const shader = `
${precision}

${quatTransform}

uniform sampler2D u_texture;
uniform float u_filterMode;
uniform bool u_unshaded;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec4 v_color;
varying vec4 v_uvTransRot;
varying float v_uvScale;
varying vec3 v_lightDir;

vec4 getDiffuseColor() {
  vec2 uv = v_uv;

  // Translation animation
  uv += v_uvTransRot.xy;

  // Rotation animation
  uv = quat_transform(v_uvTransRot.zw, uv - 0.5) + 0.5;

  // Scale animation
  uv = v_uvScale * (uv - 0.5) + 0.5;

  vec4 texel = texture2D(u_texture, uv);
  vec4 color = texel * v_color;

  // 1bit Alpha
  if (u_filterMode == 1.0 && color.a < 0.75) {
    discard;
  }

  // "Close to 0 alpha"
  if (u_filterMode >= 5.0 && color.a < 0.02) {
    discard;
  }

  return color;
}

void onlyTexCoords() {
  gl_FragColor = vec4(v_uv, 0.0, 1.0);
}

void onlyNormals() {
  gl_FragColor = vec4(v_normal, 1.0);
}

void onlyDiffuse() {
  gl_FragColor = getDiffuseColor();
}

void lambert() {
  vec4 color = getDiffuseColor();

  if (!u_unshaded) {
    float lambertFactor = clamp(dot(v_normal, v_lightDir), 0.0, 1.0);
    lambertFactor = clamp(lambertFactor + 0.7, 0.0, 1.0);

    color.rgb *= lambertFactor;
  }

  gl_FragColor = color;
}

void main() {
  #if defined(ONLY_DIFFUSE)
  onlyDiffuse();
  #elif defined(ONLY_TEXCOORDS)
  onlyTexCoords();
  #elif defined(ONLY_NORMALS)
  onlyNormals();
  #else
  lambert();
  #endif
}
`;

export default shader;
