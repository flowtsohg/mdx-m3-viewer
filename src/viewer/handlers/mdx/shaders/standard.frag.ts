import precision from '../../shaders/precision.glsl';
import quatTransform from '../../shaders/quattransform.glsl';

const shader = `
${precision}

${quatTransform}

uniform sampler2D u_texture;
uniform float u_filterMode;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec4 v_color;
varying vec4 v_uvTransRot;
varying float v_uvScale;

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

void main() {
  #if defined(ONLY_DIFFUSE)
  onlyDiffuse();
  #elif defined(ONLY_TEXCOORDS)
  onlyTexCoords();
  #elif defined(ONLY_NORMALS)
  onlyNormals();
  #else
  onlyDiffuse();
  #endif
}
`;

export default shader;
