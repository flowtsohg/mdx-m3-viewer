const shader = `
precision mediump float;

#define EMITTER_RIBBON 1

uniform sampler2D u_texture;
uniform highp int u_emitter;
uniform float u_filterMode;

varying vec2 v_texcoord;
varying vec4 v_color;

void main() {
  vec4 texel = texture2D(u_texture, v_texcoord);
  vec4 color = texel * v_color;

  // 1bit Alpha, used by ribbon emitters.
  if (u_emitter == EMITTER_RIBBON && u_filterMode == 1.0 && color.a < 0.75) {
    discard;
  }

  gl_FragColor = color;
}
`;

export default shader;
