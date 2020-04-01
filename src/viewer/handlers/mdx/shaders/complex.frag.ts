import quatTransform from '../../shaders/quattransform.glsl';

const shader = `
precision mediump float;

${quatTransform}

uniform sampler2D u_texture;
uniform float u_filterMode;

varying vec2 v_uv;
varying vec4 v_color;
varying vec4 v_uvTransRot;
varying float v_uvScale;

void main() {
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

  // if (!u_unshaded) {
  //   color *= clamp(dot(v_normal, lightDirection) + 0.45, 0.0, 1.0);
  // }

  gl_FragColor = color;
}
`;

export default shader;
