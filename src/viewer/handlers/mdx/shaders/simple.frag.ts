const shader = `
precision mediump float;

uniform sampler2D u_texture;
uniform float u_filterMode;

varying vec2 v_uv;

void main() {
  vec4 color = texture2D(u_texture, v_uv);

  // 1bit Alpha
  if (u_filterMode == 1.0 && color.a < 0.75) {
    discard;
  }

  gl_FragColor = color;
}
`;

export default shader;
